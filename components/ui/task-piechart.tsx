"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type TaskStatusData = {
  name: string;
  value: number;
  color: string;
};

interface TaskPieChartProps {
  data: TaskStatusData[];
  total: number;
}

const TaskPieChart: React.FC<TaskPieChartProps> = ({ data, total }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold">Status overview</h2>
      <p className="text-sm text-gray-600">
        Get a snapshot of the status of your work items.{" "}
        <a href="#" className="text-blue-600 underline">
          View all work items
        </a>
      </p>

      <div className="flex items-center mt-4">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className=" ml-[48px] text-center">
          <p className="text-xl font-bold">{total}</p>
          <p className="text-sm text-gray-500">Total work items</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {data.map((item, index) => (
          <li key={index} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPieChart;
