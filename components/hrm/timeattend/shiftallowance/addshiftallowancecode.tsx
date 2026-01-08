"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";

interface AddShiftAllowanceCodeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const salaryComponents = [
  "Medical Allowance",
  "PF Employee",
  "ESI Employee",
  "Conveyance Allowance",
  "Special Allowance",
  "Professional Allowance",
  "Travel Reimbursement (LTA)",
  "Food Coupons",
  "City Compensatory Allowance",
  "Daily Allowance",
  "Employee Gratuity contribution",
  "Dearness Allowance",
  "NPS Employer",
  "LWF",
  "PF Admin Charge",
];

const AddShiftAllowanceCode: React.FC<AddShiftAllowanceCodeProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [basis, setBasis] = useState("fixed");
  const [hourlyTimes, setHourlyTimes] = useState("2");
  const [fixedAmount, setFixedAmount] = useState("300");
  const [lumpFormula, setLumpFormula] = useState("");
  const [search, setSearch] = useState("");

  const handleSave = () => {
    const data = { name, basis, hourlyTimes, fixedAmount, lumpFormula };
    onSave(data);
    onClose();
  };

  const filteredComponents = salaryComponents.filter((comp) =>
    comp.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-white shadow-xl z-50 flex flex-col border-l"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Add Shift Allowance Code
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs">
              <div>
                <p className="text-gray-700 mb-1">Name</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Day Shift"
                  className="w-full border rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Payment Calculation Basis */}
              <div>
                <p className="text-gray-700 mb-2 font-medium">
                  Basis of payment calculation
                </p>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="basis"
                    value="times"
                    checked={basis === "times"}
                    onChange={() => setBasis("times")}
                  />
                  <span>
                    <input
                      type="number"
                      className="border rounded-md px-1.5 py-0.5 w-12 text-xs mx-1 focus:ring-1 focus:ring-primary"
                      value={hourlyTimes}
                      onChange={(e) => setHourlyTimes(e.target.value)}
                    />{" "}
                    time(s) of hourly pay is paid, for every hour(s) worked.
                  </span>
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="basis"
                    value="fixed"
                    checked={basis === "fixed"}
                    onChange={() => setBasis("fixed")}
                  />
                  <span>
                    Fixed amount of{" "}
                    <input
                      type="number"
                      className="border rounded-md px-1.5 py-0.5 w-16 text-xs mx-1 focus:ring-1 focus:ring-primary"
                      value={fixedAmount}
                      onChange={(e) => setFixedAmount(e.target.value)}
                    />{" "}
                    is paid per hour.
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="basis"
                    value="lump"
                    checked={basis === "lump"}
                    onChange={() => setBasis("lump")}
                  />
                  <span>
                    Lump sum amount is paid, irrespective of hour(s) worked.
                  </span>
                </label>
              </div>

              {/* Lump Sum Section */}
              <AnimatePresence>
                {basis === "lump" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded-md p-3 bg-gray-50 mt-3"
                  >
                    <p className="text-xs font-semibold text-primary mb-2">
                      Available Components
                    </p>
                    <div className="flex gap-3">
                      {/* Components List */}
                      <div className="w-1/2 border rounded-md bg-white h-56 overflow-y-auto">
                        <div className="flex items-center border-b px-2 py-1">
                          <Search className="w-3 h-3 text-gray-400 mr-1" />
                          <input
                            type="text"
                            placeholder="Search for salary component"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-xs focus:outline-none"
                          />
                        </div>
                        <div className="max-h-44 overflow-y-auto">
                          {filteredComponents.map((comp) => (
                            <div
                              key={comp}
                              className="px-2 py-1.5 text-xs hover:bg-primary/10 cursor-pointer"
                            >
                              {comp}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Formula Input */}
                      <div className="flex-1 flex flex-col">
                        <textarea
                          value={lumpFormula}
                          onChange={(e) => setLumpFormula(e.target.value)}
                          placeholder="{CTC} - [BASIC] - [HRA] * 0.5"
                          className="border rounded-md w-full h-32 text-xs px-2 py-1.5 focus:ring-1 focus:ring-primary resize-none"
                        />
                        <p className="text-[10px] text-gray-500 mt-2 leading-snug">
                          Use standard JavaScript notation for formula expressions.
                          <br />
                          Ex: (<b>[Basic]</b> * 0.40) + 1200 <br />
                          Ex: (<b>[Gross]</b> - [Basic]) * 0.4
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-3 space-x-2">
                      <button
                        onClick={() => setBasis("fixed")}
                        className="px-3 py-1 border rounded-md text-xs hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-primary text-white rounded-md text-xs hover:opacity-90"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {basis !== "lump" && (
              <div className="flex justify-end items-center border-t px-5 py-3 space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 border text-xs rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-primary text-white text-xs rounded-md hover:opacity-90"
                >
                  Save
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddShiftAllowanceCode;
