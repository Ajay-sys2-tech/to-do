// pages/dashboard.tsx
import React, { useState } from "react";
import { api } from "~/utils/api"; // Adjust according to your tRPC setup
import StatusView from "~/components/StatusView";
import PriorityView from "~/components/PriorityView";
import { type Task } from "@prisma/client";  
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [viewType, setViewType] = useState<"status" | "priority">("status");

  // Fetch tasks using tRPC query
  const { data: tasks, isLoading, error } = api.task.getTasks.useQuery();

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error.message}</div>;
  }

  const router = useRouter();
  const handleCreateTask = () => {
    router.push('/tasks');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
        <header className="max-w-7xl mx-auto p-6 flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-center">Task Dashboard</h1>
            
            {/* Toggle Button */}
            <div className="flex justify-center mb-6">
                <button 
                    onClick={handleCreateTask} 
                    className="mx-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Create Task
                </button>
                <button
                    onClick={() => setViewType(viewType === "status" ? "priority" : "status")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                    Switch View
                </button>
            </div>
        </header>

      {/* Display tasks grouped by selected view type */}
      {viewType === "status" ? (
        <StatusView tasks={tasks} />
      ) : (
        <PriorityView tasks={tasks} />
      )}
    </div>
  );
};

export default Dashboard;
