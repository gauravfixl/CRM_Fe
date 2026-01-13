"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NoAttendance() {
  const [enabled, setEnabled] = useState(true);
  const [showWorkingLess, setShowWorkingLess] = useState(false);
  const [showHoliday, setShowHoliday] = useState(false);
  const [showWeekoff, setShowWeekoff] = useState(false);

  return (
    <Card className="p-4 space-y-4 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">No attendance</h2>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600">
              Penalise when employees don't have any attendance logs
            </p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs">Deduct</p>
              <Input placeholder="E.g. 2" className="w-16 h-7 text-xs" />
              <p className="text-xs">day(s) leave for every day of no attendance</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Monthly/Weekly cycle does not apply. Employees will be penalised post buffer period.
            </p>
          </div>

          {/* Checkbox 1 */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={showWorkingLess}
                onChange={(e) => setShowWorkingLess(e.target.checked)}
                className="h-3 w-3"
              />
              Employee working less than
            </label>
            {showWorkingLess && (
              <div className="flex items-center gap-2 mt-2 pl-5">
                <Input placeholder="0" className="w-16 h-7 text-xs" />
                <Select defaultValue="Effective Hours">
                  <SelectTrigger className="w-32 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Effective Hours">Effective Hours</SelectItem>
                    <SelectItem value="Working Hours">Working Hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs">will be considered as no show</p>
              </div>
            )}
          </div>

          {/* Checkbox 2 */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={showHoliday}
                onChange={(e) => setShowHoliday(e.target.checked)}
                className="h-3 w-3"
              />
              Penalise adjoining holiday
            </label>
            {showHoliday && (
              <div className="flex items-center gap-2 mt-2 pl-5">
                <p className="text-xs">If there are</p>
                <Input placeholder="0" className="w-12 h-7 text-xs" />
                <p className="text-xs">or more day(s) with no attendance</p>
              </div>
            )}
          </div>

          {/* Checkbox 3 */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={showWeekoff}
                onChange={(e) => setShowWeekoff(e.target.checked)}
                className="h-3 w-3"
              />
              Penalise adjoining week-off
            </label>
            {showWeekoff && (
              <div className="flex items-center gap-2 mt-2 pl-5">
                <p className="text-xs">If there are</p>
                <Input placeholder="0" className="w-12 h-7 text-xs" />
                <p className="text-xs">or more day(s) with no attendance</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7 px-3">
              Discard Changes
            </Button>
            <Button size="sm" className="text-xs h-7 px-3">
              Save
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
