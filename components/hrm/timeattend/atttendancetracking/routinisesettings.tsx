"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoutiniseSettings() {
  const [cards, setCards] = useState({
    adjustment: false,
    regularisation: false,
    partial: false,
    approval: false,
  });

  const toggleCard = (key: string) => {
    setCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cardClass =
    "border rounded-lg p-4 bg-white shadow-sm space-y-2 transition-all duration-300";
  const labelClass = "flex items-center gap-2 text-xs";

  return (
    <div className="space-y-3 p-4">
      {/* Attendance Adjustment */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium">Attendance adjustment</h4>
            <p className="text-xs text-gray-500">
              Employees can edit their logged time entries
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cards.adjustment}
              onChange={() => toggleCard("adjustment")}
              className="accent-blue-600"
            />
          </label>
        </div>

        <AnimatePresence>
          {cards.adjustment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-1 pt-2 space-y-2 border-t mt-2"
            >
              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Employees can adjust attendance logs</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 2"
                />
                <p className="text-xs">times in a</p>
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>week</option>
                  <option>month</option>
                </select>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Let employees adjust up to</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 10"
                />
                <p className="text-xs">days after incident</p>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">
                  Last date to adjust for past dates in a month is
                </p>
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>10th</option>
                  <option>15th</option>
                  <option>25th</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Attendance Regularisation */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium">Attendance regularisation</h4>
            <p className="text-xs text-gray-500">
              Employees can raise a request to remove their penalties
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cards.regularisation}
              onChange={() => toggleCard("regularisation")}
              className="accent-blue-600"
            />
          </label>
        </div>

        <AnimatePresence>
          {cards.regularisation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-1 pt-2 space-y-2 border-t mt-2"
            >
              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">
                  Employees can regularise attendance logs
                </p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 2"
                />
                <p className="text-xs">times in a</p>
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>week</option>
                  <option>month</option>
                </select>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Let employees regularise up to</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 10"
                />
                <p className="text-xs">days after incident</p>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">
                  Last date to regularise for past dates in a month is
                </p>
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>10th</option>
                  <option>15th</option>
                  <option>25th</option>
                </select>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">
                  Employee is required to choose a reason for regularisation
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Partial Day */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium">Partial day</h4>
            <p className="text-xs text-gray-500">
              Employees can request permission for late/early coming or short leave
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cards.partial}
              onChange={() => toggleCard("partial")}
              className="accent-blue-600"
            />
          </label>
        </div>

        <AnimatePresence>
          {cards.partial && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-1 pt-2 space-y-2 border-t mt-2"
            >
              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Partial day is allowed for total</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 2"
                />
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>minutes</option>
                  <option>hours</option>
                </select>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Late arrival of maximum</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 120"
                />
                <p className="text-xs">minutes allowed per request</p>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Early departure of</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                  placeholder="eg. 120"
                />
                <p className="text-xs">minutes allowed per request</p>
              </div>

              <div className={labelClass}>
                <input type="checkbox" className="accent-blue-600" />
                <p className="text-xs">Allow past dated requests</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mandatory Approval */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium">Mandatory approval</h4>
            <p className="text-xs text-gray-500">
              Set up approval chain for regularisation, adjustment & partial day
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cards.approval}
              onChange={() => toggleCard("approval")}
              className="accent-blue-600"
            />
          </label>
        </div>

        <AnimatePresence>
          {cards.approval && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-1 pt-2 space-y-2 border-t mt-2"
            >
              <div className={labelClass}>
                <p className="text-xs">Approval mandatory if requests exceed</p>
                <input
                  type="number"
                  className="w-12 border rounded px-1 py-0.5 text-xs"
                />
                <p className="text-xs">times in a</p>
                <select className="border rounded px-1 py-0.5 text-xs">
                  <option>week</option>
                  <option>month</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">
                (You can add approval levels dynamically here)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
