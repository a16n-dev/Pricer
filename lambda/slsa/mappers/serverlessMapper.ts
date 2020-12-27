import { FunctionData } from "../doc";

export const generateServerlessFunction = (func: FunctionData) => {
    
    const d = {
        handler: `${func.fileName}.${func.methodName}`,
        events: [
            {
                http: {
                    path: `${func.path}`,
                    method: func.method,
                }
            }
        ]
    }
    if(func.authorizer){
        d.events[0].http['authorizer'] = {
            type: func.authorizer.type,
            authorizerId: {
                Ref: func.authorizer.ref
            }
        }
    }
    
    const res = {}
    res[func.methodName] = d
    return res;

}