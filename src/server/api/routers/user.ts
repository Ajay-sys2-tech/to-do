// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type User } from "@prisma/client";

export const userRouter = createTRPCRouter({


    getUsers: publicProcedure.query(async ({ ctx }): Promise<User[]>  => {
        const users = await ctx.db.user.findMany({
            // orderBy: { createdAt: "desc" },
        });
    
        return users ?? [];
    }),
    
});
