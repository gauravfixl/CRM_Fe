import React from "react";
import { FaPlus } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";

const Collectors: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GiMagnifyingGlass className="text-2xl text-blue-600" />
        <h1 className="text-2xl font-bold">Issue collectors</h1>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm max-w-3xl">
        An issue collector allows you to easily gather feedback on any website in the form of Cubicle issues, even from users who don’t have Cubicle accounts.
        <br /><br />
        Once you have configured the look and feel of an issue collector, simply embed the generated JavaScript in any website.
        <br />
        Visitors to your website will then see a trigger they can click to raise bugs and will get a form directly in your webapp to provide more details.
        <br />
        Then watch the feedback appear in the form of Cubicle Issues!
      </p>

      {/* Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded shadow-sm">
          <FaPlus /> Add issue collector
        </button>
      </div>

      {/* Table */}
      <div className="border-t">
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Last updated by</th>
              <th className="py-2 px-2">Issue Type</th>
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2">Activity</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-gray-500 text-center py-6">
                No issue collectors configured yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Collectors;
