import * as fs from 'fs'
import path from 'path'
import ts from 'typescript';
import { ComposedFunction } from './doc';

export const walk = (dir: string): Array<string> => {
  var results: Array<string> = [];

  let list: string[];

  try {
    list = fs.readdirSync(dir)
  } catch (error) {

  }

  list.forEach((file: string) => {

    file = path.resolve(dir, file);

    let stat: fs.Stats

    try {
      stat = fs.statSync(file)
    } catch (error) {

    }

    if (stat && stat.isDirectory()) {
      const res = walk(file)
      results = results.concat(res);
    } else {
      results.push(file);
    }

  });
  return results;
}



export const parseAnnotation = (node: ts.CallExpression): ComposedFunction => {

  let res: ComposedFunction = {}

  const name = node.expression.getText()

  if (name.includes('http')) {
    res.path = `${node.arguments[0].getText().replace(/['"]+/g, '')}`
  }

  switch (name) {
    case "httpGET":
      res.method = 'get'
      break;
    case "httpPOST":
      res.method = 'post'
      break;
    case "httpDELETE":
      res.method = 'delete'
      break;
    case "httpPATCH":
      res.method = 'patch'
      break;

    case "cognitoAuth":
      res.authorizer = {
        type: 'COGNITO_USER_POOLS',
        ref: `${node.arguments[0].getText().replace(/['"]+/g, '')}`
      }
      break;
  }

  return res
}

export const parseGlobalAnnotation = (node: ts.CallExpression): ComposedFunction => {

  let res: ComposedFunction = {}

  const name = node.expression.getText()

  switch (name) {
    case 'globalCognitoAuth':
      res.authorizer = {
        type: 'COGNITO_USER_POOLS',
        ref: `${node.arguments[0].getText().replace(/['"]+/g, '')}`
      }
      break;
  }

  return res;


}