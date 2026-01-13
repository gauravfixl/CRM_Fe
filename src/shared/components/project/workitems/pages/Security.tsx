import React from "react";
import { FaCog } from "react-icons/fa";

const Security: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Projects / <span className="text-black font-medium">my proj</span> / Project settings
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">Issue Security</h1>

      {/* Subheader */}
      <h2 className="text-lg font-semibold">Anyone</h2>

      {/* Description */}
      <p className="text-gray-700 text-sm max-w-3xl">
        Issue Security allows you to control who can and cannot view issues. They consist of a number of security levels
        which can have users/groups assigned to them.
        <br /><br />
        The issue security scheme defines how the securities are configured for this project. To change the securities,
        you can select a different issue security scheme, or modify the currently selected scheme.
      </p>

      {/* Actions Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded shadow-sm">
          <FaCog /> Actions
        </button>
      </div>

      {/* Table */}
      <div className="border-t">
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 px-2">Security Level</th>
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2">Users / Groups / Project Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="text-gray-500 text-center py-6">
                Issue security is currently not enabled for this project.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Security;
