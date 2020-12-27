export type Annotation = (...args: any[]) => void;
export type HttpAnnotation = <RequestModel>(path:string) => void;
export type GlobalAnnotation = (param: string) => void


/**
 * Specifies the function should be mapped to a GET endpoint.
 * @param RequestModel optional, specifies a model for the request
 * @param path specifies what the endpoint should be for this request
 */
export const httpGET: HttpAnnotation = <RequestModel = {}, >(path: string) => {}
/**
 * Specifies the function should be mapped to a POST endpoint.
 * @param RequestModel optional, specifies a model for the request
 * @param path specifies what the endpoint should be for this request
 */
export const httpPOST: HttpAnnotation = <RequestModel = {}, >(path: string) => {}
/**
 * Specifies the function should be mapped to a DELETE endpoint.
 * @param RequestModel optional, specifies a model for the request
 * @param path specifies what the endpoint should be for this request
 */
export const httpDELETE: HttpAnnotation = <RequestModel = {}, >(path: string) => {}
/**
 * Specifies the function should be mapped to a PATCH endpoint.
 * @param RequestModel optional, specifies a model for the request
 * @param path specifies what the endpoint should be for this request
 */
export const httpPATCH: HttpAnnotation = <RequestModel = {}, >(path: string) => {}

export const desc: Annotation = (description: string) => {}

export const auth: Annotation = (type: "COGNITO", idRef: string) => {}
export const cognitoAuth: Annotation = (idRef: string) => {}

export const globalCognitoAuth: GlobalAnnotation = (idRef: string) => {}