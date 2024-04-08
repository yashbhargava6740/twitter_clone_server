import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { User } from './user';
import { Request } from "express";
import cors from "cors";
export async function initServer() {
    const app = express();
    app.use(express.json());
    app.use(cors<Request>());
    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
        }
    });
    await graphqlServer.start();
    app.use('/graphql', expressMiddleware(graphqlServer));
    return app;
}
