// server/routers/auth.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hash } from "bcryptjs";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;

      const exists = await ctx.db.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hash(password, 12);

      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: user.email,
      };
    }),
});