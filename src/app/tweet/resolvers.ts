import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphQlContext } from "../../interfaces";
interface CreateTweetPayload {
    content: string,
    imageURL?: string,
}

const queries = {
    getAllTweets: async(parent: any, ctx: GraphQlContext) => {
        return await prismaClient.tweet.findMany({orderBy: {createdAt : 'desc'}});
    }
};
const mutations = {
    createTweet: async (parent: any, {payload}:{payload: CreateTweetPayload}, ctx: GraphQlContext) => {
        if(!ctx.user) throw new Error("You are not authenticated");
        const tweet = await prismaClient.tweet.create({
            data:{
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id }}
            },
        });
        return tweet;
    },
};

const extraResolvers =  {
    Tweet: {
        author: async (parent: Tweet) => {
            console.log(parent.authorID);
            return await prismaClient.user.findUnique({where: {id: parent.authorID}});
        }
    }
};
export const resolvers = { queries, mutations, extraResolvers };
