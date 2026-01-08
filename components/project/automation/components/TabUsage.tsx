import React, { useState } from 'react';

const months = [
  { value: 'current', label: "Current month's usage" },
  { value: 'last', label: "Last month's usage" },
  // Add more months as needed
];

const TabUsage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Placeholder data – replace with real data fetching
  const usageData: any[] = []; // No rules yet

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Explore monthly usage for this project</h2>
      <p className="mb-4 text-gray-600">
        Find the automations that are contributing most to your limits
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select month</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {usageData.length > 0 ? (
        <table className="w-full border-t border-gray-300 mt-4">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-700">
              <th className="py-2">Rule name</th>
              <th className="py-2">Used</th>
              <th className="py-2">Owner</th>
              <th className="py-2">Scope</th>
              <th className="py-2">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((rule, idx) => (
              <tr key={idx} className="border-t text-sm">
                <td className="py-2">{rule.name}</td>
                <td className="py-2">{rule.used}</td>
                <td className="py-2">{rule.owner}</td>
                <td className="py-2">{rule.scope}</td>
                <td className="py-2">{rule.enabled ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-10 text-center text-gray-500">
          <div className="flex justify-center mb-4">
            {/* Placeholder for image */}
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3" fill="#2563EB" />
              <path d="M6 9v6h12" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 15l3-3-3-3v6z" fill="#2563EB" />
            </svg>
          </div>
          <p className="text-lg font-semibold">No rules have run in this project</p>
          <p className="text-sm mt-2 text-gray-500">
            Once your automations are running you can return here to monitor the usage of your rules each month.
          </p>
        </div>
      )}
    </div>
  );
};

export default TabUsage;
