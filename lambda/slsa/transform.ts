import path, { parse } from 'path';
import ts, { ObjectLiteralExpression } from 'typescript';
import fs from 'fs';
import { parseAnnotation, parseGlobalAnnotation } from './util'
import { ComposedFunction, ComposedSchema, Documentation, FunctionData, FunctionResponse, SchemaData, SchemaProperty} from './doc';
import { ifError } from 'assert';
import { Schema } from 'js-yaml';

export default (file: string, output: string, doc: Documentation) => {

  const program = ts.createProgram([file], {});
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(file);
  const printer = ts.createPrinter();

  const isAnnotation = (node: ts.CallExpression): boolean => ['Annotation', 'HttpAnnotation'].indexOf(checker.getTypeAtLocation(node.expression)?.aliasSymbol?.escapedName.toString()) >= 0

  const isGlobalAnnotation = (node: ts.CallExpression): boolean => ['GlobalAnnotation'].indexOf(checker.getTypeAtLocation(node.expression)?.aliasSymbol?.escapedName.toString()) >= 0


  const isCallBack = (node: ts.CallExpression): boolean => {
    return node.expression.getText() === "callback"
  }

  const isLambda = (node: ts.VariableDeclaration): boolean => checker.getTypeAtLocation(node)?.aliasSymbol?.escapedName === "Handler"

  let funcData: ComposedFunction = {}

  let baseFuncData: ComposedFunction = {}

  const generateSchemaFromType = (arg: ts.Node, name: string): SchemaData => {
    const type = checker.getTypeAtLocation(arg);
    let typeName: string = type?.aliasSymbol?.getEscapedName().toString() || type.getSymbol().getEscapedName().toString();

    if (typeName === '__object') {
      //If the name comes from an object declared here it is unnamed and needs to be generated a name
      typeName = name
    } else if (typeName === 'default') {
      //If the name is default then the type comes from a default import and needs to be resolved.
      const sym = checker.getSymbolAtLocation(arg);
      if (sym) {
        //get declaration of type
        const dec = sym.getDeclarations()[0]
        if (ts.isVariableDeclaration(dec)) {
          typeName = dec.type.getFullText().toString().trim()
        }
      }
    }

    let schema = {
      name: typeName,
      properties: []
    }

    //extract type data
    type.getProperties().forEach(p => {
        const propertyType = checker.getTypeAtLocation(p.getDeclarations()[0]);
        const d = p.getDeclarations()[0]

        let optional = false;
        if(ts.isPropertySignature(d) || ts.isPropertyAssignment(d)){
          optional = Boolean(d.questionToken)
        }
       
        const propType = checker.typeToString(propertyType)
        const name = p.getName().trim()

        if (propType === 'string' || propType === 'boolean' || propType === 'number') {
          let prop: SchemaProperty = {
            name,
            type: propType,
            optional: optional,
          }
          schema.properties.push(prop)
        }
      
    })
    return schema
  }

  /**
   * This functions traverses a single lambda function and gathers data on the responses of the function
   * @param context 
   */
  const lambdaTransformer: ts.TransformerFactory<ts.VariableStatement> = context => {
    const visit: ts.Visitor = node => {
      node = ts.visitEachChild(node, visit, context);

      let responseData: FunctionResponse;

      if (ts.isCallExpression(node) && isCallBack(node)) {
        const firstArg = node.arguments[0]
        if (ts.isStringLiteral(firstArg)) {
          // console.log(`Found a status 502 response with message ${firstArg.text}`);
          funcData.responses = [
            ...(funcData?.responses || []),
            {
              status: '502'
            }]
        } else {
          //Parse response object
          const res = node.arguments[1]
          if (ts.isObjectLiteralExpression(res)) {
            const [status, body] = res.properties
            if (ts.isPropertyAssignment(status)) {
              const statusNum = status.initializer.getText()
              // console.log(`Found a status ${statusNum} response`);
              responseData = {
                status: statusNum
              }
            }

            if (ts.isPropertyAssignment(body)) {
              const exp = body.initializer
              if (ts.isCallExpression(exp)) {
                //get the identifier passed to JSON.stringify
                const arg = exp.arguments[0]

                const schema = generateSchemaFromType(arg, `${funcData.methodName}${responseData.status}Response`)

                const addedSchema = doc.addSchema(schema)
                responseData.schema = {
                  contentType: 'application/json',
                  name: addedSchema.name
                }
              }
            }
          }
        };


      }
      if (responseData) {
        funcData.responses = [
          ...(funcData?.responses || []),
          responseData
        ]
      }

      return node;
    }
    return node => ts.visitNode(node, visit);
  }

  const transformer: ts.TransformerFactory<ts.SourceFile> = context => {

    return sourceFile => {

      const visitor = (node: ts.Node): ts.Node => {

        //Remove import declaration for annotation functions
        if (ts.isImportDeclaration(node)) {
          if (node.moduleSpecifier.getText().includes('annontations')) {
            return null;
          }
        }

        //If statement is an annotation bunch it for the next lambda transform and then remove it
        if (ts.isExpressionStatement(node)) {
          const expression = node.expression as ts.CallExpression
          if (isAnnotation(expression)) {

            //Look for a type parameter
            const types = expression.typeArguments
            if(types){
              const type = checker.getTypeFromTypeNode(types[0])
              // console.log(type.get);
            }

            funcData = { ...funcData, ...parseAnnotation(expression) };
            return context.factory.createEmptyStatement();
          } else if (isGlobalAnnotation(expression)) {
            baseFuncData = { ...baseFuncData, ...parseGlobalAnnotation(expression) }
            return context.factory.createEmptyStatement();
          }
        }

        //If statement is a lambda function definition
        //mark any futher annotations to be assigned to the next lambda function
        if (ts.isVariableStatement(node)) {
          const dec = node.declarationList.declarations[0];
          if (isLambda(dec)) {

            funcData = {
              ...funcData,
              fileName: `${path.basename(file, '.ts')}`,
              methodName: `${dec.name.getText()}`,
            }

            ts.transform(node, [lambdaTransformer])

            if (funcData.method && funcData.path && funcData.fileName && funcData.methodName) {
              const func: FunctionData = {
                fileName: funcData.fileName,
                methodName: funcData.methodName,
                path: funcData.path,
                method: funcData.method,
                ...funcData,
                ...baseFuncData
              }
              doc.addFunction(func)

            } else {
              console.warn(`Method ${dec.name.getText()} is missing annotations.`);
            }
            funcData = {}
          }
        }

        return node
      };

      return ts.visitEachChild(sourceFile, visitor, context);
    };
  };

  // Run source file through our transformer
  const result = ts.transform(source, [transformer]);

  const outFile = path.relative(__dirname, file).replace('..\\src', `${output}\\src`);
  const outPath = outFile.substring(0, outFile.lastIndexOf('\\'))

  fs.mkdirSync(outPath, { recursive: true })

  // Write pretty printed transformed typescript to output directory
  fs.writeFileSync(
    outFile,
    printer.printFile(result.transformed[0])
  );
}

