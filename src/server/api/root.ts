import { createTRPCRouter } from "~/server/api/trpc";
import { generateRouter } from "./routers/generate";
import { iconRouter } from "./routers/icons";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  generate: generateRouter,
  icons: iconRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
