// pages/dashboard.tsx

import { useState } from "react";
import { api } from "~/utils/api"; // Adjust according to your tRPC setup
import { type Task } from "@prisma/client";

const Dashboard = () => {
  const [viewType, setViewType] = useState<"status" | "priority">("status");

  // Fetch tasks using tRPC query
  const { data: tasks, isLoading, error } = api.task.getTasks.useQuery();

  // Group tasks based on status or priority
  const groupByStatus = (tasks: Task[]) => {
    return tasks.reduce((groups, task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  const groupByPriority = (tasks: Task[]) => {
    return tasks.reduce((groups, task) => {
      if (!groups[task.priority]) {
        groups[task.priority] = [];
      }
      groups[task.priority].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  const renderTasks = (tasks: Task[]) => {
    return tasks.map((task) => (
      <div
        key={task.id}
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <h3 className="font-semibold text-lg text-gray-700">{task.title}</h3>
        <p className="text-sm text-gray-500">Assigned to: {task.assignedTo.join(", ")}</p>
        <p className="text-sm text-gray-400">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
      </div>
    ));
  };

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Dashboard</h1>

      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewType(viewType === "status" ? "priority" : "status")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Switch View: {viewType === "status" ? "By Priority" : "By Status"}
        </button>
      </div>

      {/* Display tasks grouped by selected view type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {viewType === "status" &&
          Object.entries(groupByStatus(tasks)).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-gray-700">{status}</h2>
              <div className="space-y-4">{renderTasks(statusTasks)}</div>
            </div>
          ))}

        {viewType === "priority" &&
          Object.entries(groupByPriority(tasks)).map(([priority, priorityTasks]) => (
            <div key={priority} className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-gray-700">{priority}</h2>
              <div className="space-y-4">{renderTasks(priorityTasks)}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
