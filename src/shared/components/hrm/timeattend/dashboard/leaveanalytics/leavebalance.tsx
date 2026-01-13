"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LeaveBalanceAvailable() {
  const [viewBy, setViewBy] = useState<"department" | "location">("department");

  return (
    <Card className="w-full bg-white shadow-sm border rounded-xl p-4 text-gray-800">
      <CardHeader className="flex items-center justify-between p-0 mb-2">
        <h2 className="text-sm font-medium">Leave Balance Available</h2>
        <div className="flex gap-3 text-xs">
          <button
            className={cn(
              "hover:underline",
              viewBy === "department" ? "font-semibold text-blue-600" : "text-gray-500"
            )}
            onClick={() => setViewBy("department")}
          >
            by Department
          </button>
          <button
            className={cn(
              "hover:underline",
              viewBy === "location" ? "font-semibold text-blue-600" : "text-gray-500"
            )}
            onClick={() => setViewBy("location")}
          >
            by Location
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <p className="text-xs text-gray-600">Paid Leave Availability by {viewBy}</p>
        <div className="h-[200px] border rounded-md bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
          [Graph Placeholder]
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] text-gray-600 mt-2">
          <span className="px-2 py-1 bg-yellow-100 rounded">Finance 3/23</span>
          <span className="px-2 py-1 bg-blue-100 rounded">Onboarding</span>
          <span className="px-2 py-1 bg-green-100 rounded">Customer Success</span>
          <span className="px-2 py-1 bg-pink-100 rounded">Dev</span>
          <span className="px-2 py-1 bg-purple-100 rounded">Testing</span>
        </div>

        {/* <div className="flex items-center gap-3 mt-2">
          <select className="border text-xs rounded-md px-2 py-1">
            <option>Business Unit</option>
          </select>
          <select className="border text-xs rounded-md px-2 py-1">
            <option>Department</option>
          </select>
          <select className="border text-xs rounded-md px-2 py-1">
            <option>Location</option>
          </select>
          <input
            type="text"
            placeholder="Search"
            className="border text-xs rounded-md px-2 py-1 w-32"
          />
        </div> */}
      </CardContent>
    </Card>
  );
}
