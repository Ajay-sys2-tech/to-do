// components/TaskCard.tsx
import React from "react";
import { type Task } from "@prisma/client";

interface TaskCardProps {
  taskData: Task;
  status: boolean; // If true, show status; if false, show priority
}

const TaskCard: React.FC<TaskCardProps> = ({ taskData, status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { boxColor: "bg-green-500 text-white", shadowColor: "shadow-green-500/50"};
      case "TO_DO":
        return { boxColor: "bg-amber-500 text-white", shadowColor: "shadow-amber-500/50"};
      case "IN_PROGRESS":
        return { boxColor: "bg-blue-500 text-white", shadowColor: "shadow-blue-500/50"};
      case "IN_REVIEW":
        return { boxColor: "bg-yellow-500 text-white", shadowColor: "shadow-yellow-500/50"};
      default:
        return { boxColor: "bg-gray-500 text-white", shadowColor: "shadow-gray-500/50"};
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return { boxColor: "bg-red-500 text-white", shadowColor: "shadow-red-500/50"} ;
      case "MEDIUM":
        return { boxColor: "bg-yellow-500 text-white", shadowColor: "shadow-yellow-500/50"} ;
      case "LOW":
        return { boxColor: "bg-green-500 text-white", shadowColor: "shadow-green-500/50"} ;
      default:
        return { boxColor: "bg-gray-500 text-white", shadowColor: "shadow-gray-500/50"} ;
    }
  };

  const getShadowColor = (): String => {
   return status ? getStatusColor(taskData.status).shadowColor : getPriorityColor(taskData.priority).shadowColor;
  };

  console.log(getShadowColor());
  const statusClass = status ? taskData.status : taskData.priority;
  const isStatusView = !status;

  return (
    <div className={`p-4 mt-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all ${getShadowColor()} `}>
      <h3 className="font-semibold text-lg text-gray-700">{taskData.title}</h3>
      <p className="text-sm text-gray-500">Assigned to: {taskData.assignedTo}</p>
      <p className="text-sm text-gray-400">Deadline: {new Date(taskData.deadline).toLocaleDateString()}</p>
      {status ? (
        <div className={`mt-2 py-1 px-3 rounded-lg ${getStatusColor(taskData.status).boxColor}`}>
          {taskData.status}
        </div>
      ) : (
        <div className={`mt-2 py-1 px-3 rounded-lg ${getPriorityColor(taskData.priority).boxColor}`}>
          {taskData.priority}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
