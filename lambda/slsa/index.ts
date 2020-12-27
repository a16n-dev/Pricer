import * as fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { deepmerge } from './deepmerge';
import { Documentation, FunctionData } from './doc';
import { generateEndpointJSON, generateSchemaJSON } from './mappers/OpenAPIMapper';
import { generateServerlessFunction } from './mappers/serverlessMapper';
import transform from './transform';
import { walk } from "./util";

const outPath = 'generated'

const generateDocumentation = (): Documentation => {

    const files = walk('src');

    console.log(`Scanning ${files.length} files...`);

    // Generate output folder
    const outputDir = path.resolve(__dirname, `../${outPath}`);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const doc = new Documentation()

    files.forEach(f => {
        transform(f, outPath, doc)
    })

    // Get information from serverless.yml
    try {
        const info: any = yaml.safeLoad(fs.readFileSync('./serverless.yml', 'utf8'));

        if (info.service) {
            doc.name = info.service;
        }

        if (info.custom['serverless-offline'].httpPort) {
            doc.addServer({
                url: `http://localhost:${info.custom['serverless-offline'].httpPort}/dev`,
                description: 'Local Development Server'
            })
        }
    } catch (e) {
        console.log(e);
    }
    return doc;
}

const writeServerlessFile = (funcs: Array<FunctionData>) => {
    //Write to serverless.yml
    let functions = {}
    funcs.forEach(f => {
        const res = generateServerlessFunction(f);
        functions = { ...functions, ...res }
    })

    try {
        const doc: any = yaml.safeLoad(fs.readFileSync('./serverless.yml', 'utf8'));

        doc.functions = functions

        doc.custom.functionsBasePath = `${outPath}/${doc.custom.functionsBasePath}`

        fs.writeFile('./serverless.yml', yaml.safeDump(doc), (err) => {
            if (err) {
                console.log(err);
            }
        });

    } catch (e) {
        console.log(e);
    }
}

const writeOpenAPIDocs = (docs: Documentation) => {
    
    const api = {
        'openapi': '3.0.0',
        info: {
            title: docs.name || 'Unnamed API',
            version: '1.0.0'
        },
        paths: {},
        components: {
            schemas: {}
        }
    }
    const schemaBasePath = '#/components/schemas/'

    //add paths
    docs.functions.forEach(f => {
        const res = generateEndpointJSON(f, schemaBasePath);
        api.paths = { ...api.paths, ...res }
    })

    //add schemas
    docs.schemas.forEach(s => {
        const apischema = generateSchemaJSON(s)
        api.components.schemas = {
            ...api.components.schemas,
            ...apischema
        }
    })

    api['servers'] = docs.servers

    return api
}

const modifyTSConfig = () => {
    const res = fs.readFileSync('tsconfig.json')
    const data = JSON.parse(res.toString());
    data.include[0] = `${outPath}/${data.include[0]}`
    fs.writeFileSync('tsconfig.json', JSON.stringify(data))
}

const output = (docs: Documentation) => {

    writeServerlessFile(docs.functions);

    const apiDocs = writeOpenAPIDocs(docs)

    fs.writeFile('./openAPI.yml', yaml.safeDump(apiDocs), (err) => {
        if (err) {
            console.log(err);
        }
    });

}

const docs = generateDocumentation();
output(docs)
modifyTSConfig()