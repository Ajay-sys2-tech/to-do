import React, { useState, type FormEvent, useEffect } from 'react';
import { api } from "~/utils/api";
import { type Task } from "@prisma/client";
import {useRouter} from 'next/router';
import { useSession } from 'next-auth/react';
// import type { AnyARecord } from 'dns';

type TaskData = {
  title: string;
  description: string;
  deadline: Date;
  assignedTo: string ;
  priority: TaskPriority ;
  status: TaskStatus  ; 
  createdBy: string ;
};

enum TaskStatus {
  BACKLOG = "BACKLOG",
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  COMPLETED = "COMPLETED",
}

enum TaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export default function TaskForm() {
  const router = useRouter();
  const { data: session } = useSession();
  
    useEffect(() => {
      if (!session) {
        void router.push("/login");
      }
    }, [session, router]);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string >('')
    

    const statusList = ["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];
    const priorityList = ["HIGH", "MEDIUM", "LOW"];

    const { mutateAsync: createTask } = api.task.createTask.useMutation();
    const {data: userData} = api.user.getUsers.useQuery(); 
   
    const [taskData, setTaskData] = useState<TaskData>({
      title: '',
      description: '',
      deadline: new Date(),
      // deadline: '',
      assignedTo: userData?.[0]?.name ?? '',
      priority: TaskPriority.LOW,
      status: TaskStatus.BACKLOG,
      createdBy: session?.user.id ?? ''
  })
   
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setTaskData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    // Handle form submission
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError('') 

        try {
            const dataToSend = {
                ...taskData,
                deadline: taskData.deadline ? new Date(taskData.deadline) : null, // Convert to Date or set null if empty
              }
            console.log(dataToSend);
            const response: Task = await createTask(dataToSend as TaskData);
            
            console.log(response);
            if (!response) {
                throw new Error('Failed to create the task. Please try again.')
            }
            setTaskData({
              title: '',
              description: '',
              deadline: new Date(),
              assignedTo: userData?.[0]?.name ?? '',
              priority: TaskPriority.LOW,
              status: TaskStatus.BACKLOG,
              createdBy: session?.user.id ?? ''
          })
            console.log('Task created:', response)
        } catch (error) {
          if(error instanceof Error)
            setError(error.message)
          console.error(error)
        } finally {
        setIsLoading(false)
        }
    }
    
    const handleGoToDashboard = () => {
      void router.push('/dashboard')
    }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white shadow-md rounded-lg">
      {/* <h2 className="text-2xl font-bold text-gray-700 mb-6">Create a New Task</h2> */}
      <header className="max-w-7xl mx-auto p-6 flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Task</h1>
            
            <div className="flex justify-center mb-6">
            <button 
                    onClick={handleGoToDashboard} 
                    className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Dashboard
                </button>
                
            </div>
        </header>
    
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              // value={taskData.deadline}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <select
              name="assignedTo"
              value={taskData.assignedTo}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
                {
                    userData?.map((user) => (
                        <option key={user.id} value={user.name ?? ''}>{user.name}</option>
                    ))
                }
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
                {
                    priorityList.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                    ))
                }
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
                {
                    statusList.map((status) => (
                        <option key={status} value={status}>{status.replace("_", " ")}</option>
                    ))
                }
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}
