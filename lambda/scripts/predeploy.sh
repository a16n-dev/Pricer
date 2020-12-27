#!/usr/bin/env bash

mkdir temp
cp serverless.yml temp/serverless.yml
cp tsconfig.json temp/tsconfig.json
ts-node slsa/index.ts