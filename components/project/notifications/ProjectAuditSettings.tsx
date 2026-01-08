'use client';

import { useState } from 'react';

const ProjectAuditSettingsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-2">
        Projects / <span className="text-gray-700 font-medium">my proj</span> / Project settings
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Project email audit</h1>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Review work item notification emails. The audit covers 21 days, showing the most recent undelivered notification email first.{' '}
        <a href="#" className="text-blue-600 hover:underline">Read about the project email audit</a>
      </p>

      {/* Alert Info */}
      <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded mb-6 border border-blue-100">
        <strong>Free plans have a limit of 100 emails per day.</strong> You can upgrade to get more.{' '}
        <a href="#" className="text-blue-600 hover:underline">Read about plans</a>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex border rounded w-full md:w-1/2">
          <span className="p-2 text-gray-500">👤</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name"
            className="flex-1 p-2 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          <option value="">Filter by status</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-t text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2 w-10"><input type="checkbox" /></th>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Details</th>
              <th className="p-2">Issue key</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
        </table>

        {/* No data message */}
        <div className="text-center text-gray-500 py-16">
          There are no unsent items to display.
        </div>
      </div>
    </div>
  );
};

export default ProjectAuditSettingsPage;
