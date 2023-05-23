import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";

const configuration = new Configuration({
  apiKey: env.DALLE_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateIcon(prompt:string) {
  if(env.DALLE_MOCK=="true") {
     return "https://picsum.photos/536/354"
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0]?.url; 
  }
}


export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure.input(
    z.object({ prompt: z.string() })
  ).mutation(async ({ctx, input}) => {
    
    console.log({trpc: input.prompt})
    //verify if user has enough credits
    const {count} = await ctx.prisma.user.updateMany({
      where: {
        id: ctx.session.user.id,
        credits: {
          gte: 1
        }
      },
      data: {
        credits: {
          decrement: 1
        }
      }
    })

    if (count <= 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Not enough credits"
      })
    }

    const url = await generateIcon(input.prompt);

    return {
      imageUrl: url,
    }
  }),
});