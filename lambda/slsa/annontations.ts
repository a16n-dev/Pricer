export type Annotation = (...args: any[]) => void;

export const http: Annotation = (method: "GET" | "POST" | "DELETE" | "PATCH", path: string) => {}
export const httpGET: Annotation = (path: string) => {}
export const httpPOST: Annotation = (path: string) => {}
export const httpDELETE: Annotation = (path: string) => {}
export const httpPATCH: Annotation = (path: string) => {}

export const desc: Annotation = (description: string) => {}

export const auth: Annotation = (type: "COGNITO", idRef: string) => {}
export const cognitoAuth: Annotation = (idRef: string) => {}