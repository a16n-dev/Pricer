import { FunctionData, SchemaData, ServerData } from "../doc";

export const generateSchemaJSON = (schema: SchemaData): any => {

    const res = {}

    res[schema.name] = {
        type: 'object',
        properties: schema.properties.reduce((obj, prop, i) => {
            obj[prop.name] = {
                type: prop.type,
            };
            return obj;
          }, {}),
          required: schema.properties.filter(v => !v.optional).map(v => v.name)
    }

    return res
}

export const generateEndpointJSON = (func: FunctionData, schemaBasePath: string): any => {
    //format name
    let name = func.path.toLowerCase().replace(/\\/g,"/");;
    if(!name.startsWith('/')){
        name = `/${name}`
    }
    if(name.endsWith('/')){
        name = name.slice(0, -1)
    }
    
    let responses = {};
    func.responses.forEach(r => {
        if(r.schema){
            let content = {}
            content[r.schema.contentType] = {
                schema: {
                    $ref: `${schemaBasePath}${r.schema.name}`
                }
            }
    
            responses[r.status] = {
                description: `Status ${r.status} response`,
                content
            }
        }
        
    })

    const method = {}
    method[func.method] = {
        operationId: `${func.methodName}`,
        responses
    }

    const res = {}
    res[name] = {...method}

    return res
}