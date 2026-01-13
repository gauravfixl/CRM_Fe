"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LateArrival() {
  const [enabled, setEnabled] = useState(true);
  const [additionalOpen, setAdditionalOpen] = useState(false);

  // Additional settings state
  const [ignorePenalty, setIgnorePenalty] = useState(true);
  const [penaliseTotalHours, setPenaliseTotalHours] = useState(false);
  const [applyMissingLogs, setApplyMissingLogs] = useState(false);

  return (
    <Card className="p-4 space-y-4 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Late Arrival</h2>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Employees are penalised if they exceed allowed number/hours of late arrivals
          </p>

          <div className="flex items-center gap-2 text-xs">
            <p className="text-xs">Penalise employees for</p>
            <Select defaultValue="number of incidents">
              <SelectTrigger className="w-40 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number of incidents">number of incidents</SelectItem>
                <SelectItem value="total hours">total hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs">of late arrival</p>
          </div>

          <p className="text-[10px] text-gray-400">
            Employees are penalised if they exceed allowed number of late arrivals
          </p>

          <div className="flex items-center gap-2 text-xs">
            <p className="text-xs">Grace period, before an employee is considered late, is</p>
            <Input placeholder="0" className="w-12 h-7 text-xs" />
            <p className="text-xs">min(s) every day</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <p className="text-xs">Exempt</p>
            <Input placeholder="0" className="w-12 h-7 text-xs" />
            <p className="text-xs">late arrival(s) in a</p>
            <Select defaultValue="Week">
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Week">Week</SelectItem>
                <SelectItem value="Month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-[10px] text-gray-400">
            Weekly configuration is effective from 17th June. 13th June to 16th June will not be tracked.
            To change this date <span className="text-blue-500 cursor-pointer">click here</span>.
          </p>

          <div className="flex items-center gap-2 text-xs">
            <p className="text-xs">Post</p>
            <Input placeholder="0" className="w-12 h-7 text-xs" />
            <p className="text-xs">late arrivals, deduct</p>
            <Input placeholder="E.g. 2" className="w-16 h-7 text-xs" />
            <p className="text-xs">day(s) of leave for every</p>
            <Input placeholder="1" className="w-12 h-7 text-xs" />
            <p className="text-xs">day(s) of late arrival</p>
          </div>

          {/* Additional settings */}
          <div className="border-t pt-2">
            <button
              onClick={() => setAdditionalOpen(!additionalOpen)}
              className="w-full text-left text-xs text-gray-700 font-medium flex items-center justify-between py-2"
            >
              Additional settings
              <span className="text-gray-500">{additionalOpen ? "▲" : "▼"}</span>
            </button>

            {additionalOpen && (
              <div className="bg-gray-50 border rounded-md p-3 mt-2 space-y-3">
                {/* 1️⃣ Ignore penalty */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={ignorePenalty}
                      onChange={(e) => setIgnorePenalty(e.target.checked)}
                      className="h-3 w-3"
                    />
                    Ignore late arrival penalty, when employee completes desired
                  </label>
                  {ignorePenalty && (
                    <div className="flex items-center gap-2 mt-2 pl-5">
                      <Select defaultValue="Effective Hours">
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Effective Hours">Effective Hours</SelectItem>
                          <SelectItem value="Working Hours">Working Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs">in a day</p>
                    </div>
                  )}
                </div>

                {/* 2️⃣ Penalise total late hours */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={penaliseTotalHours}
                      onChange={(e) => setPenaliseTotalHours(e.target.checked)}
                      className="h-3 w-3"
                    />
                    Penalise if total late hours are exceeded in a day
                  </label>
                </div>

                {/* 3️⃣ Apply penalty for missing logs */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={applyMissingLogs}
                      onChange={(e) => setApplyMissingLogs(e.target.checked)}
                      className="h-3 w-3"
                    />
                    Apply penalty for any late arrival caused by missing logs
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
