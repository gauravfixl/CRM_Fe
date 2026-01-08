import React from "react";
import { BsBookmarkCheck } from "react-icons/bs";
import { FaBug } from "react-icons/fa";
import { PiLightningBold } from "react-icons/pi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { TbSubtask } from "react-icons/tb";
import { FiEdit2 } from "react-icons/fi";

const Screens: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">MP: Scrum Issue Type Screen Scheme</h1>

      {/* Info Box */}
      <div className="bg-blue-100 p-4 rounded-md text-sm text-gray-800">
        <strong className="block mb-2">Layout in the new Cubicle issue view</strong>
        <p>
          The order of fields in the <a href="#" className="text-blue-600 underline">new issue view</a> is set for issue types in a project, so that issues have a consistent look across different project locations, like boards, backlogs, search, and the full-page issue view.
        </p>
        <p className="mt-2">
          To configure the layout of issue types in a project, go to <strong>Project settings &gt; Issue layout</strong>.
        </p>
        <p className="mt-2">
          Alternatively, and for issues on personal and multi-project boards, open an issue on the board and choose <strong>... &gt; Configure</strong>.
        </p>
        <a href="#" className="text-blue-600 underline block mt-2">
          Learn more about configuring the new issue view
        </a>
      </div>

      {/* Description */}
      <div className="text-gray-700 text-sm">
        Screens allow you to arrange the fields to be displayed for an issue. Different screens can be used when an issue is created, viewed, edited, or transitioned through a workflow.
        <br />
        <br />
        The screen scheme defines which screens apply to this project. To change the screens used, you can select a different screen scheme, or modify the currently selected scheme.
        <br />
        <br />
        <strong>This project uses 2 screen configurations.</strong>
      </div>

      {/* MP: Scrum Default Screen Scheme */}
      <div className="border border-gray-300 rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">MP: Scrum Default Screen Scheme</h2>
          <FiEdit2 className="text-gray-600 cursor-pointer" />
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <BsBookmarkCheck className="text-blue-500" /> Story <span className="bg-gray-300 text-xs px-1 ml-1 rounded">DEFAULT</span>
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <PiLightningBold className="text-purple-500" /> Epic
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <IoCheckmarkDoneCircleOutline className="text-cyan-600" /> Task
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <TbSubtask className="text-indigo-600" /> Sub-task
          </span>
        </div>
      </div>

      {/* MP: Scrum Bug Screen Scheme */}
      <div className="border border-gray-300 rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">MP: Scrum Bug Screen Scheme</h2>
          <FiEdit2 className="text-gray-600 cursor-pointer" />
        </div>
        <div className="flex gap-3 text-sm">
          <span className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-md">
            <FaBug className="text-red-500" /> Bug
          </span>
        </div>
      </div>
    </div>
  );
};

export default Screens;
