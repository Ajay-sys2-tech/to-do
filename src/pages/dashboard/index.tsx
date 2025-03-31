// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import { api } from "~/utils/api"; // Adjust according to your tRPC setup
import StatusView from "~/components/StatusView";
import PriorityView from "~/components/PriorityView";
import { type Task } from "@prisma/client";  
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';


const Dashboard = () => {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      void router.push("/login");
    }
  }, [])

  const [viewType, setViewType] = useState<"status" | "priority">("status");

  // Fetch tasks using tRPC query
  const { data: tasks, isLoading, error } = api.task.getTasks.useQuery();

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error.message}</div>;
  }

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
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Create Task
                </button>
                <button
                    onClick={() => setViewType(viewType === "status" ? "priority" : "status")}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                    Switch View
                </button>
                {session 
                  ? <>
                      <button
                        onClick={() => signOut()}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                        Logout
                      </button>
                      <button
                        onClick={() => signOut()}
                        className="ml-4 w-12 h-12  bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                        {session.user?.name?.charAt(0)}
                    </button>
                </>  
                  : <></>
                }
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
