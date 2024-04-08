import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";

interface authResponse {
    iss?: string
    azp?: string
    aud?: string
    sub?: string
    hd?: string
    email: string
    email_verified?: string
    nbf?: string
    name?: string
    picture?: string
    given_name: string
    family_name?: string
    iat?: string
    exp?: string
    jti?: string
    alg?: string
    kid?: string
    typ?: string
}

const queries = {
    verifyGoogleToken: async(parent: any, { token }:{ token: string }) => {
        // console.log(token);
        const googleToken = token;
        const oathUrl = new URL('https://oauth2.googleapis.com/tokeninfo');
        oathUrl.searchParams.set('id_token', googleToken);
        const { data } = await axios.get<authResponse>(oathUrl.toString(), {
            responseType: 'json'
        });
        const user = await prismaClient.user.findUnique({where: {
            email: data.email
        }});
        if(!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageUrl: data.picture,
                }
            })
        }
        const userInDb = await prismaClient.user.findUnique({
            where: {
                email: data.email,
            }
        });
        if(!userInDb) throw new Error("Internal Error Occured!");
        const customToken = JWTService.generateWebToken(userInDb);
        return customToken;
    }
}

export const resolvers = { queries };