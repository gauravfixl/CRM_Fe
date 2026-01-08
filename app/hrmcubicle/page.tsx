"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import TabBar from "@/components/hrm/tabbar";
import SetupPage from "@/components/hrm/org/setup";

export default function DashboardPage() {
  const [activeMainTab, setActiveMainTab] = useState("DASHBOARD");
  const [activeSubTab, setActiveSubTab] = useState("organization");
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 ">
      {/* ---- Main Tabs ---- */}
      <TabBar
        tabs={[
          "DASHBOARD",
          "PRODUCT UPDATES",
          "CUBICLE SETUP",
          "SUPPORT",
        ]}
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
      />

      {/* ---- Header ---- */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white py-5 px-8 shadow-sm">
        <h6 className="text-xl font-medium tracking-tight">
          Welcome Pooja Harplani!
        </h6>
      </div>

      {/* ---- TAB CONTENT ---- */}
      <div className="px-8 py-8 space-y-8">
        {activeMainTab === "DASHBOARD" && (
          <>
            {/* Quick Access */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                Quick Access
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                {/* Inbox */}
                <div className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">Inbox</h3>
                    <p className="text-gray-500 text-xs mt-1">Good job!</p>
                    <p className="text-gray-400 text-xs">
                      You have no pending actions
                    </p>
                  </div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
                    alt="inbox"
                    className="w-12 h-12"
                  />
                </div>

                {/* Holidays */}
                <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
                  <h3 className="font-medium text-gray-800 text-sm mb-1">
                    Holidays
                  </h3>
                  <div className="text-center py-4 text-gray-500 text-xs bg-gray-50 rounded-md">
                    No holidays
                  </div>
                </div>

                {/* On Leave */}
                <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
                  <h3 className="font-medium text-gray-800 text-sm mb-1">
                    On Leave Today
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Everyone is working today!
                  </p>
                  <p className="text-gray-400 text-xs">
                    No one is on leave today.
                  </p>
                </div>
              </div>
            </section>

            {/* Sub Tabs */}
            <section>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveSubTab("organization")}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${
                    activeSubTab === "organization"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Organization
                </button>

                <button
                  onClick={() => setActiveSubTab("operations")}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${
                    activeSubTab === "operations"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Operations
                </button>
              </div>

              {/* Sub Tab Content */}
              <div className="bg-white rounded-lg shadow-sm mt-5 p-5">
                {activeSubTab === "organization" ? (
                  <>
                    <div className="flex space-x-4 border-b border-gray-100 pb-2 mb-4 text-xs font-medium">
                      <button className="text-blue-600 flex items-center space-x-1">
                        ✏️ <span>Post</span>
                      </button>
                      <button className="text-gray-600 flex items-center space-x-1 hover:text-blue-500">
                        📊 <span>Poll</span>
                      </button>
                      <button className="text-gray-600 flex items-center space-x-1 hover:text-blue-500">
                        🏅 <span>Praise</span>
                      </button>
                    </div>
                    <textarea
                      placeholder="Write your post here and mention your peers"
                      className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                    />
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No announcements in Operations yet.
                  </p>
                )}
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-lg shadow-sm p-5 flex justify-between items-center mt-5 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">No announcements</p>
                <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition">
                  <Plus size={16} />
                </button>
              </div>

              {/* Birthdays Section */}
              <div className="bg-white rounded-lg shadow-sm mt-5 hover:shadow-md transition">
                <div
                  className="flex justify-between items-center px-5 py-3 cursor-pointer"
                  onClick={() => setIsBirthdayOpen(!isBirthdayOpen)}
                >
                  <div className="flex space-x-6 text-gray-700 text-xs font-medium">
                    <span>🎂 0 Birthdays</span>
                    <span>🎉 0 Work Anniversaries</span>
                    <span>👥 0 New Joinees</span>
                  </div>
                  {isBirthdayOpen ? (
                    <ChevronUp className="text-gray-500 w-4 h-4" />
                  ) : (
                    <ChevronDown className="text-gray-500 w-4 h-4" />
                  )}
                </div>

                {isBirthdayOpen && (
                  <div className="px-5 py-6 text-center border-t text-gray-500 text-xs">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4479/4479696.png"
                      alt="cake"
                      className="mx-auto w-12 mb-3 opacity-90"
                    />
                    <p>No birthdays today.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ---- PRODUCT UPDATES TAB ---- */}
        {activeMainTab === "PRODUCT UPDATES" && (
          <div className="bg-white rounded-lg shadow-sm p-5 text-sm text-gray-600">
            <h2 className="font-semibold text-base mb-2 text-gray-800">
              Product Updates
            </h2>
            <p>🎉 Stay tuned! Product updates will appear here soon.</p>
          </div>
        )}

        {/* ---- CUBICLE SETUP TAB ---- */}
        {activeMainTab === "CUBICLE SETUP" && (
          <div className="bg-white rounded-lg shadow-sm p-5 text-sm text-gray-600">
            <h2 className="font-semibold text-base mb-2 text-gray-800">
              Cubicle Setup
            </h2>
           <SetupPage/>
          </div>
        )}

        {/* ---- SUPPORT TAB ---- */}
        {activeMainTab === "SUPPORT" && (
          <div className="bg-white rounded-lg shadow-sm p-5 text-sm text-gray-600">
            <h2 className="font-semibold text-base mb-2 text-gray-800">
              Support
            </h2>
            <p>💬 Contact HR or IT support if you need help.</p>
          </div>
        )}
      </div>
    </div>
  );
}
