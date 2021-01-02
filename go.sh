#!/bin/bash

mkdir -p client/src/models
mkdir -p lambda/src/models
cp model/* client/src/models
cp model/* lambda/src/models