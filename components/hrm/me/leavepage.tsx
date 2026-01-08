"use client";
import React, { useState } from "react";
import TabBar from "@/components/hrm/tabbar";
import { Info } from "lucide-react";

const LeavePage = () => {
  const [year, setYear] = useState("Jan 2025 - Dec 2025");

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-[13px] text-gray-700">
      {/* Top TabBar */}
      <TabBar
        tabs={["SUMMARY", "MY REQUESTS", "TEAM LEAVE", "POLICIES"]}
        onTabChange={(tab) => console.log("Selected Tab:", tab)}
      />

      {/* Header Section */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="font-semibold text-[14px]">Summary</h1>
        <button className="border border-blue-500 text-blue-600 px-3 py-[4px] rounded text-[12px] hover:bg-blue-50">
          {year}
        </button>
      </div>

      {/* Pending Leave Requests */}
      <div className="bg-white rounded border border-gray-200 p-4 mt-3 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">
            🎉 Hurray! No pending leave requests
          </p>
          <p className="text-gray-500 text-[12px]">Request leave on the right!</p>
        </div>
        <div className="text-right">
          <button className="bg-blue-600 text-white text-[12px] px-3 py-[5px] rounded hover:bg-blue-700">
            Request Leave
          </button>
          <p className="text-blue-600 text-[12px] mt-1">Leave Policy Explanation</p>
        </div>
      </div>

      {/* My Leave Stats */}
      <h2 className="mt-6 mb-2 font-semibold text-[14px]">My Leave Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Weekly Pattern", "Consumed Leave Types", "Monthly Stats"].map(
          (title) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded p-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-[13px]">{title}</h3>
                <Info size={14} className="text-gray-400" />
              </div>
              <div className="h-[80px] bg-gray-100 rounded"></div>
            </div>
          )
        )}
      </div>

      {/* Leave Balances */}
      <h2 className="mt-6 mb-2 font-semibold text-[14px]">Leave Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Casual Leave", "Paid Leave", "Unpaid Leave"].map((type) => (
          <div
            key={type}
            className="bg-white border border-gray-200 rounded p-3 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{type}</h3>
              <button className="text-blue-600 text-[12px] hover:underline">
                View details
              </button>
            </div>
            <div className="h-[100px] bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeavePage;
