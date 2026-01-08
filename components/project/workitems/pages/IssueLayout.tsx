import React from "react";
import { FaBug } from "react-icons/fa";
import { PiLightningBold } from "react-icons/pi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { BsBookmarkCheck } from "react-icons/bs";
import { TbSubtask } from "react-icons/tb";

const IssueLayout: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Issue layout</h1>
        <p className="text-gray-600 mt-2">
          This page lets you set the visibility and order of fields for this project's issue types in the issue view.
        </p>
        <p className="text-gray-600 mt-2">
          The fields available to you for each issue type are defined in the global screen configuration for viewing the issue type. To add or remove fields for an issue type, go to your project’s{" "}
          <a href="#" className="text-blue-600 underline">screen settings</a>.
        </p>
        <div className="mt-4 text-sm text-gray-700">
          <p className="font-semibold">Note:</p>
          <ul className="list-disc ml-6 mt-1">
            <li>Where issue types share the same screen configuration, you’ll edit their field ordering together and they’ll appear in a group below.</li>
            <li>Field order in the global screen configuration won’t affect the layout of the issue view.</li>
          </ul>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-purple-100 text-sm text-gray-800 p-4 rounded-md relative">
        <strong className="block text-black mb-1">Speed up your team’s issue layout updates</strong>
        Grant your team the <strong>Manage Issue Layouts</strong> permission so they can manage issue layouts themselves.
        <div className="mt-2">
          <a href="#" className="text-blue-600 underline">Go to permission schemes</a>
        </div>
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>
      </div>

      {/* Group 1 - Shared screen config */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Issue types in this project</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <BsBookmarkCheck className="text-blue-600" /> Story
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <PiLightningBold className="text-purple-500" /> Epic
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <IoCheckmarkDoneCircleOutline className="text-cyan-600" /> Task
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <TbSubtask className="text-indigo-600" /> Sub-task
          </div>
        </div>
        <p className="text-sm text-gray-700">
          These issue types show the fields defined in <a href="#" className="text-blue-600 underline">MP: Scrum Default Issue Screen</a>.
        </p>
        <button className="text-blue-600 hover:underline text-sm font-medium mt-1">
          Edit issue layout
        </button>
      </div>

      {/* Group 2 - Bug */}
      <div className="space-y-1 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-md text-sm">
            <FaBug className="text-red-500" /> Bug
          </div>
        </div>
        <p className="text-sm text-gray-700">
          This issue type shows the fields defined in <a href="#" className="text-blue-600 underline">MP: Scrum Bug Screen</a>.
        </p>
        <button className="text-blue-600 hover:underline text-sm font-medium mt-1">
          Edit issue layout
        </button>
      </div>
    </div>
  );
};

export default IssueLayout;
