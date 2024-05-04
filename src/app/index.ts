import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { User } from './user';
import { Tweet } from './tweet';
import { Request } from "express";
import cors from "cors";
import JWTService from '../services/jwt';
import { GraphQlContext } from '../interfaces';
export async function initServer() {
    const app = express();
    app.use(express.json());
    app.use(cors<Request>());
    const graphqlServer = new ApolloServer<GraphQlContext>({
        typeDefs: `
            ${User.types}
            ${Tweet.types}
            type Query {
                ${User.queries}
                ${Tweet.queries}
            }
            type Mutation{
                ${Tweet.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
            },
            Mutation: {
                ...Tweet.resolvers.mutations
            },
            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        }
    });
    await graphqlServer.start();
    app.use('/graphql', expressMiddleware(graphqlServer, {
        context: async ({req, res}) => {
            return {
                user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split(' ')[1]) : undefined
            }
        }
    }));
    return app;
}
