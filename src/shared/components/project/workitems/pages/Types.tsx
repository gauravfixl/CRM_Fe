import React from "react";
import { FaBug } from "react-icons/fa";
import { TbSubtask } from "react-icons/tb";
import { PiLightningBold } from "react-icons/pi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { BsBookmarkCheck } from "react-icons/bs";

interface IssueType {
  type: string;
  icon: React.ReactNode;
  description: string;
  workflow: string;
  fieldConfig: string;
  screen: string;
}

const issues: IssueType[] = [
  {
    type: "Story",
    icon: <BsBookmarkCheck className="text-blue-500" />,
    description: "Stories track functionality or features expressed as user goals.",
    workflow: "Software Simplified Workflow for Project MP",
    fieldConfig: "Default Field Configuration",
    screen: "MP: Scrum Default Screen Scheme",
  },
  {
    type: "Bug",
    icon: <FaBug className="text-red-500" />,
    description: "A problem or error.",
    workflow: "Software Simplified Workflow for Project MP",
    fieldConfig: "Default Field Configuration",
    screen: "MP: Scrum Bug Screen Scheme",
  },
  {
    type: "Epic",
    icon: <PiLightningBold className="text-purple-500" />,
    description:
      "A big user story that needs to be broken down. Created by Cubicle Software - do not edit or delete.",
    workflow: "Software Simplified Workflow for Project MP",
    fieldConfig: "Default Field Configuration",
    screen: "MP: Scrum Default Screen Scheme",
  },
  {
    type: "Task",
    icon: <IoCheckmarkDoneCircleOutline className="text-cyan-500" />,
    description: "A small, distinct piece of work.",
    workflow: "Software Simplified Workflow for Project MP",
    fieldConfig: "Default Field Configuration",
    screen: "MP: Scrum Default Screen Scheme",
  },
  {
    type: "Sub-task",
    icon: <TbSubtask className="text-blue-600" />,
    description: "A small piece of work that's part of a larger task.",
    workflow: "Software Simplified Workflow for Project MP",
    fieldConfig: "Default Field Configuration",
    screen: "MP: Scrum Default Screen Scheme",
  },
];

const Types: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">MP: Scrum Issue Type Scheme</h2>
      <p className="text-gray-600 mb-6">
        Keep track of different types of issues, such as bugs or tasks. Each issue type can be configured differently.
      </p>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-3 border">Issue Type</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Workflow</th>
              <th className="p-3 border">Field Configuration</th>
              <th className="p-3 border">Screen</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3 flex items-center gap-2 font-medium">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  {issue.icon}
                  {issue.type}
                </td>
                <td className="p-3">{issue.description}</td>
                <td className="p-3 text-blue-600 underline cursor-pointer">
                  {issue.workflow}
                </td>
                <td className="p-3 text-blue-600 underline cursor-pointer">
                  {issue.fieldConfig}
                </td>
                <td className="p-3 text-blue-600 underline cursor-pointer">
                  {issue.screen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Types;
