import React, { useState } from "react";

const TabAuditLog = () => {
  const [showStatuses, setShowStatuses] = useState(false);

  return (
    <div>
      <div className="border rounded p-4 bg-gray-50 text-center text-gray-500">
        No rule executions found matching the given filter.
      </div>

      {/* Toggle explanation */}
      <button
        onClick={() => setShowStatuses(!showStatuses)}
        className="text-left mt-4 text-blue-600 hover:underline"
      >
        ▸ What do the different statuses mean?
      </button>

      {showStatuses && (
        <div className="mt-3 border p-4 rounded bg-white space-y-2 text-sm">
          {[
            ["CONFIG CHANGE", "rule configuration was changed by an administrator."],
            ["SUCCESS", "rule completed without errors and performed some actions successfully."],
            ["NO ACTIONS PERFORMED", "rule executed successfully, but no actions were performed."],
            ["IN PROGRESS", "rule is currently executing."],
            ["WAITING", "rule is delayed or waiting for an external application."],
            ["QUEUED FOR RETRY", "some errors occurred; retry will happen later."],
            ["LOOP", "rule loop detected; likely self-triggering."],
            ["THROTTLED", "rule exceeded allowed limits."],
            ["SOME ERRORS", "rule was disabled, deleted, or hit execution limits."],
            ["FAILURE", "a system error occurred – please contact support."],
          ].map(([status, description]) => (
            <div key={status} className="flex items-start gap-2">
              <span className="font-bold inline-block w-48">{status}</span>
              <span>{description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabAuditLog;
