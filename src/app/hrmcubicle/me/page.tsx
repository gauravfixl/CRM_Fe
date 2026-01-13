"use client";

import React, { useState } from "react";
import TabBar from "@/components/hrm/tabbar";
import { Clock, Info, Coffee } from "lucide-react";
import LeavePage from "../leave/page";
import PerformancePage from "@/components/hrm/me/performancepage";
import AppsPage from "@/components/hrm/me/myapps";

const HrmDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("ATTENDANCE");
  const [timeFormat24, setTimeFormat24] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-3 text-[13px] text-gray-700">
      {/* === Top TabBar === */}
      <TabBar
        tabs={[
          "ATTENDANCE",
          "LEAVE",
          "PERFORMANCE",
          "EXPENSES & TRAVEL",
          "APPS",
        ]}
        onTabChange={setActiveTab}
      />

      {/* === Dynamic Content Area === */}
      {activeTab === "ATTENDANCE" && (
        <>
          {/* === Attendance Overview === */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Attendance Stats */}
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <h2 className="text-[14px] font-semibold mb-2">Attendance Stats</h2>
              <div className="space-y-3">
                {[
                  { icon: "M", color: "bg-yellow-400", label: "Me" },
                  { icon: "T", color: "bg-blue-500", label: "My Team" },
                ].map(({ icon, color, label }, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 ${color} rounded-full text-white flex items-center justify-center text-xs font-bold`}
                      >
                        {icon}
                      </div>
                      <span>{label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 text-[13px]">5h 52m</p>
                      <p className="text-[11px] text-gray-500">0% on-time</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <h2 className="text-[14px] font-semibold mb-2">Timings</h2>
              <div className="flex justify-between items-center mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 text-[12px] flex items-center justify-center rounded-full cursor-pointer ${
                      day === "T"
                        ? "bg-cyan-400 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="text-[12px] text-gray-600 mb-1">
                Today (9:15 AM - 6:15 PM)
              </div>
              <div className="relative h-[5px] bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-cyan-400 w-4/5"></div>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                <Coffee size={12} /> Duration: 9h 0m
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-[14px] font-semibold mb-2">Actions</h2>
                <div className="text-[18px] font-mono text-gray-800">02:27:33 PM</div>
                <div className="text-[11px] text-gray-500 mb-1">
                  Thu, 09 Oct 2025
                </div>
                <p className="text-[12px] text-gray-600 mb-1">
                  <span className="font-semibold">4h 59m</span> Since Last Login
                </p>
                <div className="space-y-[2px] mt-1">
                  <button className="text-blue-600 hover:underline text-[12px]">
                    Partial Day Request
                  </button>
                  <button className="text-blue-600 hover:underline text-[12px]">
                    Attendance Policy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[12px] text-gray-600">24 hour format</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFormat24}
                    onChange={() => setTimeFormat24(!timeFormat24)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>
            </div>
          </div>

          {/* === Logs & Requests === */}
          <div className="mt-6">
            <h2 className="text-[14px] font-semibold mb-2">Logs & Requests</h2>
            <div className="flex space-x-3 border-b border-gray-200">
              {["Attendance Log", "Calendar", "Attendance Requests"].map(
                (tab, idx) => (
                  <button
                    key={idx}
                    className={`pb-[6px] text-[13px] font-medium ${
                      idx === 0
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Table */}
            <div className="bg-white mt-3 rounded-md shadow-sm border border-gray-100 overflow-x-auto">
              <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100">
                <h3 className="text-[13px] font-semibold text-gray-700">
                  Last 30 Days
                </h3>
                <div className="flex space-x-1">
                  {["30 DAYS", "SEP", "AUG", "JUL", "JUN", "MAY", "APR"].map(
                    (btn, i) => (
                      <button
                        key={i}
                        className={`px-2 py-[3px] text-[12px] rounded ${
                          i === 0
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {btn}
                      </button>
                    )
                  )}
                </div>
              </div>

              <table className="w-full text-[12px] text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {[
                      "DATE",
                      "ATTENDANCE VISUAL",
                      "EFFECTIVE HOURS",
                      "GROSS HOURS",
                      "ARRIVAL",
                      "LOG",
                    ].map((col, i) => (
                      <th key={i} className="px-3 py-2 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Thu, 09 Oct", "0h 0m +", "0h 0m +", "0:12:57 late"],
                    ["Wed, 08 Oct", "0h 0m +", "0h 0m +", "0:15:39 late"],
                  ].map(([date, eff, gross, arrival], i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{date}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs">•••</td>
                      <td className="px-3 py-2">{eff}</td>
                      <td className="px-3 py-2">{gross}</td>
                      <td className="px-3 py-2 flex items-center space-x-1 text-yellow-600">
                        <Clock size={12} />
                        <span>{arrival}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        <Info size={12} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* === Leave Page when selected === */}
      {activeTab === "LEAVE" && (
        <div className="mt-4">
          <LeavePage />
        </div>
      )}
       {activeTab === "PERFORMANCE" && (
        <div className="mt-4">
          <PerformancePage/>
        </div>
      )}
      {activeTab === "APPS" && (
        <div className="mt-4">
         <AppsPage/>
        </div>
      )}
    </div>
  );
};

export default HrmDashboardPage;
