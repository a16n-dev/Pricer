import * as fs from 'fs'
import path from 'path'
import ts from 'typescript';

export const walk = (dir: string, done: (err: Error, results?: Array<string>) => void) => {
  var results: Array<string> = [];

  fs.readdir(dir, function (err: Error, list: string[]) {

    if (err) return done(err);

    var pending = list.length;

    if (!pending) {
      return done(null, results)
    };
    list.forEach(function (file: string) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

export const parseAnnotation = (node: ts.CallExpression, event: any) => {

  switch (node.expression.getText()) {
    case "httpGET":
      return {
        ...event,
        http: {
          path: `${node.arguments[0].getText().replace(/['"]+/g, '')}`,
          method: 'get'
        }
      }

    case "httpPOST":
      return {
        ...event,
        http: {
          path: `${node.arguments[0].getText().replace(/['"]+/g, '')}`,
          method: 'post'
        }
      }

    case "cognitoAuth":
      return {
        ...event,
        http: {
          ...event?.http,
          authorizer: {
            type: 'COGNITO_USER_POOLS',
            authorizerId: {
              Ref: `${node.arguments[0].getText().replace(/['"]+/g, '')}`
            }
          }
        }
      }
  }
}