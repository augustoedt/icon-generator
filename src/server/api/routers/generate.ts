import { TRPCError } from "@trpc/server";
import AWS from "aws-sdk";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { img64 } from "~/data/img64";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "icon-ai-generator";

const configuration = new Configuration({
  apiKey: env.DALLE_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateIcon(prompt: string) {
  if (env.DALLE_MOCK == "true") {
    return img64;
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });
    console.log(response.data.data[0]?.b64_json);
    return response.data.data[0]?.b64_json;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log({ trpc: input.prompt });
      //verify if user has enough credits
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough credits",
        });
      }

      const base64EncodedImage = await generateIcon(input.prompt);

      if (env.DALLE_MOCK == "true") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          imageUrl:
            "https://icon-ai-generator.s3.sa-east-1.amazonaws.com/clihmso0d0000210c6g65sudx",
        };
      }

      if (!base64EncodedImage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No image generated",
        });
      }

      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: input.prompt,
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });

      await s3
        .putObject({
          Bucket: env.S3_BUCKET,
          Body: Buffer.from(base64EncodedImage, "base64"),
          Key: icon.id,
          ContentType: "image/png",
          ContentEncoding: "base64",
        })
        .promise();

      return {
        imageUrl: `https://${BUCKET_NAME}.s3.sa-east-1.amazonaws.com/${icon.id}`,
      };
    }),
});
