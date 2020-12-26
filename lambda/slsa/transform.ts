import path, { parse } from 'path';
import ts from 'typescript';
import fs from 'fs';
import {parseAnnotation} from './util'

export default (file: string, output: string) => {

    const program = ts.createProgram([file], {});
    const checker = program.getTypeChecker();
    const source = program.getSourceFile(file);
    const printer = ts.createPrinter();
    
    let data: any = {}

    const isAnnotation = (node: ts.CallExpression): boolean => checker.getTypeAtLocation(node.expression)?.aliasSymbol?.escapedName === "Annotation"

    const isLambda = (node: ts.VariableDeclaration): boolean => checker.getTypeAtLocation(node)?.aliasSymbol?.escapedName === "Handler"

    /**
     * This functions traverses the source file and bundles annotations into their respective lambda functions
     * @param context 
     */
    
    const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    
        let event: any = {};
      
        return sourceFile => {
      
          const visitor = (node: ts.Node): ts.Node => {
      
            //Remove import declaration for annotation functions
            if(ts.isImportDeclaration(node)){
              if(node.moduleSpecifier.getText().includes('annontations')){
                return null;
              }
            }
      
            //If statement is an annotation bunch it for the next lambda transform
            if(ts.isExpressionStatement(node)){
              const expression = node.expression as ts.CallExpression
              if(isAnnotation(expression)){
                event = parseAnnotation(expression, event);
                return context.factory.createEmptyStatement();
              }
            }
      
            //If statement is a lambda function definition
            //mark any futher annotations to be assigned to the next lambda function
            if(ts.isVariableStatement(node)){
              const dec = node.declarationList.declarations[0] ;
              if(isLambda(dec)){
                data[`${dec.name.getText()}`] = {
                  handler: `${path.basename(file, '.ts')}.${dec.name.getText()}`,
                  events: [event]
                }
                event = {};
              }
            }
      
            return node
          };
      
          return ts.visitEachChild(sourceFile, visitor,context);
        };
      };
    
    // Run source file through our transformer
    const result = ts.transform(source, [transformer]); 

    const outFile = path.relative(__dirname, file).replace('..\\src','out\\src');
    const outPath = outFile.substring(0, outFile.lastIndexOf('\\'))

    fs.mkdirSync(outPath, { recursive: true })

    // Write pretty printed transformed typescript to output directory
    fs.writeFileSync(
        outFile,
        printer.printFile(result.transformed[0])
    );

    return data;
}

