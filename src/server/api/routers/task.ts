import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Task, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const taskRouter = createTRPCRouter({

    createTask: publicProcedure
    .input(
        z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        deadline: z.date(),
        assignedTo: z.array(z.string()).optional(), // Assuming it's an array of userIds or usernames
        priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
        status: z.enum(["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]),
        })
    )
    .mutation(async ({ ctx, input }): Promise<Task>  => {
    // const createdBy = ctx.session.user.id;  // Example: get user ID from session (replace with your actual logic)
    const createdBy = 2;
    // const newTask: Task = await prisma.task.create({
    //     data: {
    //       title: input.title,
    //       description: input.description,
    //       deadline: input.deadline,
    //       assignedTo: input.assignedTo ?? [],  // Default to an empty array if not provided
    //       priority: input.priority,
    //       status: input.status,
    //       createdBy,  // Attach the user who created the task
    //     },
    //   }
    // );

    return (await ctx.db.task.create({
      data: {
        title: input.title,
        description: input.description,
        deadline: input.deadline,
        assignedTo: input.assignedTo ?? [],  // Default to an empty array if not provided
        priority: input.priority,
        status: input.status,
        createdBy,  // Attach the user who created the task
      },
    }));

    // return newTask;
  }),


    getTasks: publicProcedure.query(async ({ ctx }): Promise<Task[]>  => {
        const post = await ctx.db.task.findMany({
        orderBy: { createdAt: "desc" },
        });
    
        return post ?? null;
    }),
    
});
