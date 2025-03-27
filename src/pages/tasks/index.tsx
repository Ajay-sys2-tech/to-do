import React, { useState, FormEvent } from 'react';
import { api } from "~/utils/api";
import { type Task } from "@prisma/client";

export default function TaskForm() {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
        assignedTo: [] as string[],
        priority: 'LOW',
        status: 'BACKLOG',
    })

    const statusList = ["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];
    const priorityList = ["HIGH", "MEDIUM", "LOW"];

    const { mutateAsync: createTask } = api.task.createTask.useMutation();
    const {data: userData} = api.user.getUsers.useQuery(); 
   
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === 'assignedTo') {
            const assigneeList = [value];
        setTaskData((prevState) => ({
            ...prevState,
            [name]: assigneeList
        }))
        } else {
        setTaskData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
        }
        console.log(taskData);
    }

    // Handle form submission
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null) 

        try {
            const dataToSend = {
                ...taskData,
                deadline: taskData.deadline ? new Date(taskData.deadline) : null, // Convert to Date or set null if empty
              }
            console.log(dataToSend);
            const response: Task = await createTask(dataToSend);
            
            console.log(response);
            if (!response) {
                throw new Error('Failed to create the task. Please try again.')
            }

            console.log('Task created:', response)
        } catch (error: any) {
        setError(error.message)
        console.error(error)
        } finally {
        setIsLoading(false)
        }
    }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Create a New Task</h2>
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
              value={taskData.deadline}
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
                    userData.map((user) => (
                        <option key={user.id} value={user.name}>{user.name}</option>
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
