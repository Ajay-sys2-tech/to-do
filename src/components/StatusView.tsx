// components/StatusView.tsx
import React from "react";
import { type Task } from "@prisma/client";
import TaskCard from "./TaskCard";

interface StatusViewProps {
  tasks: Task[] | undefined;
}

const StatusView: React.FC<StatusViewProps> = ({ tasks }) => {
  // Group tasks by their status
  const groupByStatus = (tasks: Task[] | undefined):Record<string, Task[]> | undefined => {
    return tasks?.reduce((groups, task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups?.[task.status]?.push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  const statusGroups = groupByStatus(tasks);
  console.log(statusGroups);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            {["Backlog", "To-Do", "In Progress", "In Review", "Completed"].map((status) => (
              <th key={status} className="px-4 py-2 text-center">{status}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"].map((status) => (
              <td key={status} className="px-4 py-2 align-top">
                {statusGroups?.[status]?.map((task) => (
                  <TaskCard key={task.id} taskData={task} status={false} />
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatusView;
