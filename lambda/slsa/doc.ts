//Stores all data extracted around a particular function
export interface FunctionData {
    /**
     * The filename that the method is contained in
     */
    fileName: string
    /**
     * The name of the method that is being exported
     */
    methodName: string
    /**
     * The path to place the api endpoint at
     */
    path: string
    /**
     * The method for the endpoint, either get, post, delete or patch
     */
    method: 'get' | 'post' | 'delete' | 'patch'
    /**
     * The authorizer for the endpoint, if applicable
     */
    authorizer?: {
        type: string,
        ref: string,
    }
    summary?: string,
    description?: string,
    responses?: Array<FunctionResponse>
    requestSchemaName?: string;
}

export interface ComposedFunction {
    fileName?: string
    methodName?: string
    path?: string
    method?: 'get' | 'post' | 'delete' | 'patch'
    authorizer?: {
        type: string,
        ref: string,
    }
    summary?: string,
    description?: string,
    responses?: Array<FunctionResponse>
    requestSchemaName?: string;
}

export interface FunctionResponse {
    status: string;
    description?: string;
    schema?: {
        contentType: string;
        name: string;
    };
}

//Stores all data extracted around a particular schema
export interface SchemaData {
    name: string;
    properties: Array<SchemaProperty>
}

export interface ComposedSchema {
    name?: string;
    properties?: Array<SchemaProperty>;
}

export interface SchemaProperty {
    name: string;
    type: 'string' | 'boolean' | 'number';
    optional?: boolean;
}

export interface FileDocumentation {
    functions: Array<FunctionData>;
    schemas: Array<SchemaData>;
}

export interface ServerData {
    url: string;
    description: string;
}

export class Documentation {

    name: string
    schemas: Array<SchemaData>
    functions: Array<FunctionData>
    servers: Array<ServerData>

    constructor(){
        this.schemas = []
        this.functions = []
        this.servers = []
    }

    addSchema(schema: SchemaData): SchemaData {

        const mod ={
            ...schema,
            name: schema.name.charAt(0).toUpperCase() + schema.name.slice(1),
        }

        this.schemas.push(mod)
        return mod
    }

    addFunction(func: FunctionData) {
        this.functions.push(func)
    }

    addServer(server: ServerData) {
        this.servers.push(server)
    }

    getSchemas = (): Array<SchemaData> => this.schemas

    getFunctions = (): Array<FunctionData> => this.functions
}