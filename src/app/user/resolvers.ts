import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphQlContext, JWTUser } from "../../interfaces";

import { User } from "@prisma/client";

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
    },

    getCurrentUser: async(parent: any, args:any, ctx: GraphQlContext) =>{
        const id = ctx.user?.id;
        if(!id) return null;
        const user = await prismaClient.user.findUnique({
            where : {
                id: id
            }
        });
        if(user) return user;
        else throw new Error("User not found in database!");
    }
}

const extraResolvers = {
    User: {
        tweets: async (parent: User) => {
            return await prismaClient.tweet.findMany({where: {authorID: parent.id}}); 
        }
    }
};

export const resolvers = { queries, extraResolvers };
