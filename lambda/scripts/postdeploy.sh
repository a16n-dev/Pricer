#!/usr/bin/env bash

ts-node slsa/parseProdServer.ts
openapi-generator-cli generate -g typescript-axios -i openAPI.yml -o ./generated/client
mkdir client
cp generated/client/*.ts client/
cp temp/serverless.yml serverless.yml
cp temp/tsconfig.json tsconfig.json
rm -r temp
rm -r generated
