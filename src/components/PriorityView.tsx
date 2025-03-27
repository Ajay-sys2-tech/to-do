// components/PriorityView.tsx
import React from "react";
import { type Task } from "@prisma/client";
import TaskCard from "./TaskCard";

interface PriorityViewProps {
  tasks: Task[];
}

const PriorityView: React.FC<PriorityViewProps> = ({ tasks }) => {
  // Group tasks by their priority
  const groupByPriority = (tasks: Task[]) => {
    return tasks.reduce((groups, task) => {
      if (!groups[task.priority]) {
        groups[task.priority] = [];
      }
      groups[task.priority].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  const priorityGroups = groupByPriority(tasks);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            {["Low", "Medium", "High"].map((priority) => (
              <th key={priority} className="px-4 py-2 text-center">{priority}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["LOW", "MEDIUM", "HIGH"].map((priority) => (
              <td key={priority} className="px-4 py-2">
                {priorityGroups[priority]?.map((task) => (
                  <TaskCard key={task.id} taskData={task} status={true} />
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PriorityView;
