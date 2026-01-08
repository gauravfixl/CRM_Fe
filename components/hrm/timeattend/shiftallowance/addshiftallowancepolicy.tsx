"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface AddShiftAllowancePolicyProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddShiftAllowancePolicy: React.FC<AddShiftAllowancePolicyProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [policyName, setPolicyName] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("9");
  const [timeTo, setTimeTo] = useState("19");
  const [payCode, setPayCode] = useState("DAYSHIFT");
  const [applyWeeklyOffs, setApplyWeeklyOffs] = useState(false);
  const [applyHolidays, setApplyHolidays] = useState(true);

  const [ignoreFlexible, setIgnoreFlexible] = useState(false);
  const [configureIndividual, setConfigureIndividual] = useState(false);
  const [ignoreIfWorkBelow, setIgnoreIfWorkBelow] = useState(false);
  const [ignoreThreshold, setIgnoreThreshold] = useState("");

  const handleSave = () => {
    const formData = {
      policyName,
      description,
      timeFrom,
      timeTo,
      payCode,
      applyWeeklyOffs,
      applyHolidays,
      ignoreFlexible,
      configureIndividual,
      ignoreIfWorkBelow,
      ignoreThreshold,
    };
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
        >
          <motion.div
            className="bg-white w-full h-full  shadow-lg flex flex-col  overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="text-sm font-medium text-primary">
                Add Shift Allowance Policy
              </h2>
              <button onClick={onClose}>
                <X className="w-4 h-4 text-gray-500 hover:text-primary" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs text-gray-700">
              <p className="text-xs text-gray-600">
                You can create a new shift allowance policy here
              </p>

              {/* Policy name & description */}
              <div className="space-y-2">
                <div>
                  <label className="block text-gray-600 mb-1">
                    Shift Allowance Policy Name
                  </label>
                  <input
                    type="text"
                    value={policyName}
                    onChange={(e) => setPolicyName(e.target.value)}
                    placeholder="Enter policy name"
                    className="w-full border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Applies to all developers"
                    rows={2}
                    className="w-full border rounded-md px-2 py-1 text-xs resize-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Main Config Section */}
              <div className="space-y-3">
                <h6 className="text-gray-800 text-xs font-medium">
                  Shifts to be considered for the purpose of shift allowance calculation
                </h6>

                <label className="flex items-start space-x-2">
                  <input type="checkbox" checked readOnly />
                  <p className="text-xs text-gray-700 leading-snug">
                    I would like to configure shift allowance based on the time range,
                    i.e., all shifts whose start time falls within a specified time
                    duration, will be paid at a defined rate.
                  </p>
                </label>

                {/* Time & Paycode */}
                <div className="border rounded-md bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-2">
                  <p className="text-xs">If shift start time is between</p>
                  <select
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i}>
                        {i % 12 || 12} {i < 12 ? "AM" : "PM"}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs">and</p>
                  <select
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i}>
                        {i % 12 || 12} {i < 12 ? "AM" : "PM"}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs">shift allowance is paid as</p>
                  <select
                    value={payCode}
                    onChange={(e) => setPayCode(e.target.value)}
                    className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                  >
                    <option value="DAYSHIFT">DAYSHIFT</option>
                    <option value="NIGHTSHIFT">NIGHTSHIFT</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                  <button className="ml-auto text-primary hover:underline text-xs flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add More
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ignoreFlexible}
                    onChange={(e) => setIgnoreFlexible(e.target.checked)}
                  />
                  <p className="text-xs">Ignore employees assigned flexible shifts for allowance consideration.</p>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={configureIndividual}
                    onChange={(e) => setConfigureIndividual(e.target.checked)}
                  />
                  <p className="text-xs">I would like to configure shift allowance per predefined shifts individually.</p>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ignoreIfWorkBelow}
                    onChange={(e) => setIgnoreIfWorkBelow(e.target.checked)}
                  />
                  <div className="flex items-center gap-1">
                    <p className="text-xs">Ignore shift allowance calculation if work hours of employee is less than</p>
                    <input
                      type="number"
                      className="w-12 border rounded-md px-1 py-0.5 text-xs focus:ring-1 focus:ring-primary"
                      placeholder="%"
                      value={ignoreThreshold}
                      onChange={(e) => setIgnoreThreshold(e.target.value)}
                    />
                    <select className="border rounded-md px-1.5 py-0.5 text-xs focus:ring-1 focus:ring-primary">
                      <option>Gross Hours</option>
                      <option>Net Hours</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Applicability */}
              <div className="pt-2">
                <h6 className="text-gray-800 text-xs font-medium">
                  Shift allowance is also applicable for the following days:
                </h6>

                <div className="flex items-center space-x-3 mt-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={applyWeeklyOffs}
                      onChange={(e) => setApplyWeeklyOffs(e.target.checked)}
                    />
                    <p className="text-xs">Weekly Offs</p>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={applyHolidays}
                      onChange={(e) => setApplyHolidays(e.target.checked)}
                    />
                    <p className="text-xs">Holidays</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t px-4 py-2 bg-gray-50">
              <button
                onClick={onClose}
                className="px-3 py-1 text-xs border rounded-md border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="ml-2 px-3 py-1 text-xs bg-primary text-white rounded-md hover:opacity-90"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddShiftAllowancePolicy;
