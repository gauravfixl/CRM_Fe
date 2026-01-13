"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import CustomProfile from "./customiseprofile";

export default function EmployeeProfileStructure() {
  const [activeTab, setActiveTab] = useState("Employee profile layout");
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [showCustomProfile, setShowCustomProfile] = useState(false); // ⬅️ When true, show CustomProfile

  const tabs = [
    "Employee profile layout",
    "Employee Defaults",
    "Job Titles",
    "Employee Number",
    "Timeline",
    "Wall",
    "Personal Info",
    "ID Card",
    "Dotted Line Manager",
  ];

  // If "Customise" is confirmed, render the CustomProfile UI instead
  if (showCustomProfile) {
    return <CustomProfile />;
  }

  return (
    <div className="p-4 text-xs bg-white min-h-screen">
      {/* Header Tabs */}
      <div className="border-b mb-4 flex items-center gap-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 text-xs font-semibold whitespace-nowrap ${
              activeTab === tab
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title and Country Selector */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-semibold">Employee profile structure</h2>
          <p className="text-[11px] text-gray-500">
            Customise structure of the employee profile in your organisation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border rounded-md px-2 py-1 text-xs"
          >
            <option>India</option>
            <option>USA</option>
          </select>
          <Button
            size="sm"
            className="bg-blue-600 text-white px-3 py-1 text-xs h-6"
            onClick={() => setShowModal(true)}
          >
            Customise
          </Button>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="border rounded-md p-3 flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg rounded-md">
          X
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm mb-1">Employee Name</div>
          <div className="flex flex-wrap gap-3 text-[11px] text-gray-600">
            <span>Job Title</span>
            <span>Work Email</span>
            <span>Mobile Number</span>
            <span>Work Location</span>
            <span>Employee Number</span>
          </div>
          <div className="grid grid-cols-6 mt-2 text-[11px] text-gray-500">
            <div>
              Business Unit
              <br />
              XXXXXXXXXX
            </div>
            <div>
              Department
              <br />
              XXXXXXXXXX
            </div>
            <div>
              Sub Department
              <br />
              XXXXXXXXXX
            </div>
            <div>
              Cost Center
              <br />
              XXXXXXXXXX
            </div>
            <div>
              Reporting Manager
              <br />
              XXXXXXXXXX
            </div>
            <div>
              Dotted Line Manager
              <br />
              XXXXXXXXXX
            </div>
          </div>
        </div>
      </div>

      {/* Tabs under Profile */}
      <div className="flex gap-6 border-b pb-2 mb-3 text-xs">
        <div className="text-blue-600 border-b-2 border-blue-600 bg-white px-2 py-1 rounded-t-sm font-semibold cursor-pointer">
          PROFILE
        </div>
        <div className="text-gray-500 cursor-pointer hover:text-blue-600">
          JOB
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-white">
          <div className="font-semibold mb-2 text-gray-700">Primary Details</div>
          <div className="grid grid-cols-2 gap-y-1 text-[11px] text-gray-600">
            <div>
              First Name
              <br />
              XXXXXXX
            </div>
            <div>
              Middle Name
              <br />
              XXXXXXX
            </div>
            <div>
              Last Name
              <br />
              XXXXXXX
            </div>
            <div>
              Display Name
              <br />
              XXXXXXX
            </div>
            <div>
              Gender
              <br />
              XXXXXXX
            </div>
            <div>
              Date of Birth
              <br />
              XXXXXXX
            </div>
          </div>
        </div>

        <div className="border rounded-md p-3 bg-white">
          <div className="font-semibold mb-2 text-gray-700">Contact Details</div>
          <div className="grid grid-cols-2 gap-y-1 text-[11px] text-gray-600">
            <div>
              Work Email
              <br />
              XXXXXXX
            </div>
            <div>
              Personal Email
              <br />
              XXXXXXX
            </div>
            <div>
              Mobile Number
              <br />
              XXXXXXX
            </div>
            <div>
              Work Number
              <br />
              XXXXXXX
            </div>
            <div>
              Residence Number
              <br />
              XXXXXXX
            </div>
            <div>
              Skype
              <br />
              XXXXXXX
            </div>
          </div>
        </div>
      </div>

      {/* Customise Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Confirm work location before customising field permissions
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <p className="text-gray-600">
              Kindly confirm the work location of employees for whom you want to
              customise the field permissions.
            </p>

            {/* Editable Country Dropdown */}
            <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
              <span className="text-lg">
                {selectedCountry === "India" ? "🇮🇳" : "🇺🇸"}
              </span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border rounded-md px-2 py-1 text-xs focus:outline-none bg-white"
              >
                <option>India</option>
                <option>USA</option>
              </select>
            </div>

            {/* Warning Box */}
            <div className="flex items-start gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md p-2">
              <AlertTriangle className="w-4 h-4 mt-[2px]" />
              <p>
                Changes made on the next page will apply to all employees in the
                selected work location.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white text-xs"
              onClick={() => {
                setShowModal(false);
                setShowCustomProfile(true); // ⬅️ Switch to CustomProfile component
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
