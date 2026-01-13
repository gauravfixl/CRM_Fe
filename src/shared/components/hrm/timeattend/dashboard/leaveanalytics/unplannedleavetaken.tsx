"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function UnplannedLeaveTaken() {
  const [viewBy, setViewBy] = useState<"department" | "location">("location");

  return (
    <Card className="w-full bg-white shadow-sm border rounded-xl p-4 text-gray-800">
      <CardHeader className="flex items-center justify-between p-0 mb-2">
        <h2 className="text-sm font-medium">Unplanned Leave Taken</h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 border rounded px-2 py-[2px]">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span>May 11, 2024 - Jun 09, 2024</span>
          </span>
          <div className="flex gap-3">
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
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <p className="text-xs text-gray-600">Unplanned Leave Taken by {viewBy}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/4 space-y-2 text-xs">
            {["New York", "US Division", "Kuwait", "CMS", "Remote"].map((loc) => (
              <div key={loc} className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  {loc}
                </span>
                <span>0 hour</span>
              </div>
            ))}
          </div>

          <div className="flex-1 h-[200px] border rounded-md bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
            [Graph Placeholder]
          </div>
        </div>

        <div className="flex flex-wrap justify-between text-[11px] text-gray-600 mt-2">
          <span>Most Unplanned Leave Taken: <span className="font-medium">Hyderabad_2904</span></span>
          <span>Min Leave on a Day: <span className="font-medium">4 Hours</span></span>
          <span>Max Leave on a Day: <span className="font-medium">16 Hours</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
