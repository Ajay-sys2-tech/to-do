import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {type Task, PrismaClient } from "@prisma/client";
// import { getSession } from 'next-auth/react'; 
// import { Context } from '~/server/context';
// const prisma = new PrismaClient()

export const taskRouter = createTRPCRouter({

    createTask: publicProcedure
    .input(
        z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        deadline: z.date(),
        // deadline: z.string(),
        assignedTo: z.string(), 
        // priority: z.string(),
        priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
        // status: z.string(),
        status: z.enum(["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]),
        createdBy: z.string().min(1),
        })
    )
    .mutation(async ({ ctx, input }): Promise<Task>  => {
      // if (!ctx.session?.user?.id) {
      //   throw new Error('User not authenticated');
      // }

      // // Access the authenticated user ID from session
      // const createdBy = ctx.session.user.id; 
      console.log("------------------------------\n", input);
    // const createdBy = "cm8x0jde70000u9pd8sm7b1dl";
    
    return (await ctx.db.task.create({
      data: {
        title: input.title,
        description: input.description,
        deadline: input.deadline,
        assignedTo: input.assignedTo ,  // Default to an empty array if not provided
        priority: input.priority,
        status: input.status,
        createdBy: input.createdBy,  // Attach the user who created the task
      },
    }));

  }),


    getTasks: publicProcedure.query(async ({ ctx }): Promise<Task[]>  => {
        const tasks = await ctx.db.task.findMany({
        orderBy: { createdAt: "desc" },
        });
    
        return tasks ?? [];
    }),
    
});
