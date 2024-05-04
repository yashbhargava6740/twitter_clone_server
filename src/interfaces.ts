export interface JWTUser {
    id: string,
    email: string,
}
export interface GraphQlContext {
    user?: JWTUser,
}