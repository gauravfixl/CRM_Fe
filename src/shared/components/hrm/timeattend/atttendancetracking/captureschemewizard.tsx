"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Smartphone,
  MapPin,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import GeoFenceDrawer from "./geofence";
import RoutiniseSettings from "./routinisesettings";

export default function AttendanceWizard({ open, onClose, selectedAnswers, onSave}) {
  const [selected, setSelected] = useState("mobile");
  const [showGeo, setShowGeo] = useState(false);
  const [workFromHomeEnabled, setWorkFromHomeEnabled] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
const [schemeName, setSchemeName] = useState("");

  const tabs = [
    { key: "mobile", label: "Mobile clock-in", icon: <Smartphone size={14} /> },
    { key: "remote", label: "Remote work", icon: <UserCheck size={14} /> },
    { key: "bio", label: "Bio-metric", icon: <MapPin size={14} /> },
    { key: "regularise", label: "Regularise", icon: <CalendarDays size={14} /> },
  ];

  const visibleTabs = useMemo(
    () =>
      tabs.filter((tab) => {
        if (tab.key === "bio") return selectedAnswers.biometric === true;
        if (tab.key === "remote") return selectedAnswers.remote === true;
        if (tab.key === "mobile") return selectedAnswers.mobile === true;
        return false;
      }),
    [selectedAnswers]
  );

  const hiddenTabs = tabs.filter(
    (tab) => !visibleTabs.some((t) => t.key === tab.key)
  );

  const handleGeoSelect = (data) => {
    console.log("Selected GeoFence:", data);
    setShowGeo(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-end z-50 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="bg-white rounded-t-2xl shadow-xl w-full overflow-hidden flex flex-col h-full text-xs"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-2 border-b">
                <input
  type="text"
  placeholder="Enter policy name"
  value={schemeName}
  onChange={(e) => setSchemeName(e.target.value)}
  className="border rounded-md w-full px-2 py-1 mt-2 text-xs focus:outline-none"
/>

                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-44 border-r flex flex-col text-xs">
                  {visibleTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelected(tab.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-left ${
                        selected === tab.key
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}

                  {hiddenTabs.length > 0 && (
                    <div className="mt-auto border-t">
                      <p className="px-3 py-1.5 text-[10px] text-gray-500">
                        + Add capture methods
                      </p>
                      {hiddenTabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setSelected(tab.key)}
                          className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50 text-xs"
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {/* ===== MOBILE CLOCK-IN ===== */}
                  {selected === "mobile" && (
                    <>
                      <h3 className="text-xs font-medium mb-1.5">
                        Mobile clock-in
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Employees can log into the Cubicle mobile app and mark
                        their attendance.
                      </p>

                      <div className="space-y-2">
                        <Checkbox
                          label="Enable geo-fencing"
                          onChange={(e) => setShowGeo(e.target.checked)}
                        />
                        <Checkbox label="Automatically clock-in/out when employee moves in or out of geo location" />
                        <Checkbox label="Comment is mandatory at the time of first clock-in" />
                        <Checkbox label="Approval mandatory for first clock-in of the day" />
                      </div>
                    </>
                  )}

                  {/* ===== REMOTE CLOCK-IN ===== */}
                  {selected === "remote" && (
                    <div className="space-y-4">
                      {/* Work from Home */}
                      <div className="border rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="text-xs font-medium">
                              Work from home
                            </h3>
                            <p className="text-xs text-gray-500">
                              Employees can request for work from home
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={workFromHomeEnabled}
                            onChange={(e) =>
                              setWorkFromHomeEnabled(e.target.checked)
                            }
                            className="accent-blue-600"
                          />
                        </div>

                        <AnimatePresence>
                          {workFromHomeEnabled && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-2 overflow-hidden"
                            >
                              <OptionCheckbox label="Employees can request for maximum of">
                                <input
                                  type="number"
                                  placeholder="2"
                                  className="w-10 border rounded px-1 py-0.5 text-xs"
                                />
                                <span className="text-xs">
                                  days of WFH in
                                </span>
                                <select className="border rounded px-1 py-0.5 text-xs">
                                  <option>week</option>
                                  <option>month</option>
                                </select>
                              </OptionCheckbox>

                              <OptionCheckbox label="Allow half day WFH" />
                              <OptionCheckbox label="Allow hourly WFH" />

                              <OptionCheckbox label="WFH request requires">
                                <input
                                  type="number"
                                  placeholder="5"
                                  className="w-10 border rounded px-1 py-0.5 text-xs"
                                />
                                <span className="text-xs">
                                  days of prior notice
                                </span>
                              </OptionCheckbox>

                              <OptionCheckbox label="Approval mandatory if requests exceed">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-8 border rounded px-1 py-0.5 text-xs"
                                />
                                <span className="text-xs">times in a</span>
                                <select className="border rounded px-1 py-0.5 text-xs">
                                  <option>week</option>
                                  <option>month</option>
                                </select>
                              </OptionCheckbox>

                              <OptionCheckbox label="Limit number of times WFH can be taken" />
                              <OptionCheckbox label="Employee should apply for remote work within">
                                <input
                                  type="number"
                                  placeholder="10"
                                  className="w-10 border rounded px-1 py-0.5 text-xs"
                                />
                                <span className="text-xs">days</span>
                              </OptionCheckbox>

                              <OptionCheckbox label="Last date to request for post-dated remote work in a month is">
                                <input
                                  type="number"
                                  placeholder="25"
                                  className="w-10 border rounded px-1 py-0.5 text-xs"
                                />
                              </OptionCheckbox>

                              <OptionCheckbox label="Employee can request only on">
                                <select className="border rounded px-1 py-0.5 text-xs">
                                  <option>Select days</option>
                                  <option>Weekdays</option>
                                  <option>Weekends</option>
                                </select>
                              </OptionCheckbox>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Additional Settings */}
                      <div className="border rounded-lg p-3 shadow-sm">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => setShowAdditional(!showAdditional)}
                        >
                          <div>
                            <h3 className="text-xs font-medium">
                              Additional Settings
                            </h3>
                            <p className="text-xs text-gray-500">
                              Attachment, restrictions and more
                            </p>
                          </div>
                          {showAdditional ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>

                        <AnimatePresence>
                          {showAdditional && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-2 space-y-2 overflow-hidden"
                            >
                              <OptionCheckbox label="Employees cannot request remote work on">
                                <select className="border rounded px-1 py-0.5 text-xs">
                                  <option>Holidays & Weekly Offs</option>
                                  <option>Holidays only</option>
                                  <option>Weekly offs only</option>
                                </select>
                              </OptionCheckbox>

                              <OptionCheckbox label="Attachment is mandatory while requesting for remote work" />
                              <OptionCheckbox label="Remote work requests cannot be made more than">
                                <input
                                  type="number"
                                  placeholder="25"
                                  className="w-10 border rounded px-1 py-0.5 text-xs"
                                />
                                <span className="text-xs">days in advance</span>
                              </OptionCheckbox>
                              <OptionCheckbox label="Employees can clock-in/out during remote work" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                      {selected === "regularise" && (
                   <RoutiniseSettings/>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-5 py-2">
                <button
                  onClick={onClose}
                  className="text-gray-600 px-3 py-1 text-xs"
                >
                  Discard Changes
                </button>
               <button
onClick={() => {
  if (!schemeName.trim()) return alert("Please enter a policy name");
  onSave({
    name: schemeName.trim(),
    employees: 0,
  });
  setSchemeName("");
  onClose();
}}

  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
>
  Save
</button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <GeoFenceDrawer
        open={showGeo}
        onClose={() => setShowGeo(false)}
        onSelect={handleGeoSelect}
      />
    </>
  );
}

/* Compact checkbox + optional inline fields */
function OptionCheckbox({ label, children }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-start gap-2 text-xs">
      <input
        type="checkbox"
        className="mt-0.5 accent-blue-600"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <div className="text-xs">
        <p className="text-xs">{label}</p>
        {checked && children && (
          <div className="flex flex-wrap gap-1.5 mt-1 text-gray-600 text-xs">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/* Simple reusable checkbox */
function Checkbox({ label, onChange }) {
  return (
    <label className="flex items-start gap-2 text-xs">
      <input
        type="checkbox"
        className="mt-0.5 accent-blue-600"
        onChange={onChange}
      />
      <p className="text-xs">{label}</p>
    </label>
  );
}
