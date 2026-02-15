"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function AddShiftWizard({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (shift: {
    name: string;
    code: string;
    description?: string;
    fixed: boolean;
    days: number[];
    breaks: { start: string; end: string }[];
    timings: { start: string; end: string };
  }) => void;
}) {
  const [shiftName, setShiftName] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [fixed, setFixed] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [showBreak, setShowBreak] = useState(false);
  const [breaks, setBreaks] = useState([{ start: "13:00", end: "14:00" }]);
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Utility to convert "HH:mm" -> total minutes
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const totalShiftMinutes =
    timeToMinutes(shiftEnd) - timeToMinutes(shiftStart) || 0;

  const totalBreakMinutes = breaks.reduce((sum, b) => {
    const start = timeToMinutes(b.start);
    const end = timeToMinutes(b.end);
    return sum + Math.max(0, end - start);
  }, 0);

  const isBreakExceeding = totalBreakMinutes > totalShiftMinutes;

  const handleAddBreak = () => {
    setBreaks([...breaks, { start: "00:00", end: "00:00" }]);
  };

  const handleSave = () => {
    if (!shiftName.trim() || !shiftCode.trim()) {
      alert("Please enter shift name and code.");
      return;
    }

    if (isBreakExceeding) {
      alert("Total break time cannot exceed total shift duration.");
      return;
    }

    onSave({
      name: shiftName,
      code: shiftCode,
      description,
      fixed,
      days: selectedDays,
      breaks,
      timings: { start: shiftStart, end: shiftEnd },
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-50 flex flex-col text-xs overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-2 text-xs">
            <p className="font-medium text-gray-700">Add Shift</p>
            <div className="flex items-center gap-2">
              <Button
                className="text-xs px-3 py-1 bg-primary hover:bg-primary text-white"
                onClick={handleSave}
                disabled={isBreakExceeding}
              >
                Save
              </Button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Form */}
            <div className="flex-1 p-5 overflow-y-auto">
              <p className="text-gray-600 mb-4">
                You can create a new shift here.
              </p>

              {/* Shift Name / Code */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 mb-1">Shift Name</label>
                  <input
                    type="text"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    className="border rounded-md w-full px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Day shift"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Shift Code</label>
                  <input
                    type="text"
                    value={shiftCode}
                    onChange={(e) => setShiftCode(e.target.value)}
                    className="border rounded-md w-full px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="DAY"
                  />
                </div>
              </div>

              {/* Add Description Section */}
              {!showDescription ? (
                <button
                  onClick={() => setShowDescription(true)}
                  className="text-primary text-[11px] mb-3 hover:underline"
                >
                  + Add description
                </button>
              ) : (
                <div className="mb-3">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Enter shift description..."
                    className="border rounded-md w-full px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {/* Shift Type */}
              <div className="flex gap-5 mb-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={fixed}
                    onChange={() => setFixed(true)}
                    className="w-3 h-3"
                  />
                  <span>Fixed shift timings</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={!fixed}
                    onChange={() => setFixed(false)}
                    className="w-3 h-3"
                  />
                  <span>Flexible work hours</span>
                </label>
              </div>

              {/* Shift Timing */}
              <div>
                <p className="font-medium mb-2 text-gray-700">Shift timings</p>

                {/* Days Selector */}
                <div className="flex gap-2 mb-3">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedDays((prev) =>
                          prev.includes(i)
                            ? prev.filter((x) => x !== i)
                            : [...prev, i]
                        )
                      }
                      className={`w-7 h-7 rounded-full text-xs flex items-center justify-center border ${
                        selectedDays.includes(i)
                          ? "bg-primary text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Time Fields */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center border rounded-md px-2 py-1">
                    <input
                      type="time"
                      value={shiftStart}
                      onChange={(e) => setShiftStart(e.target.value)}
                      className="text-xs outline-none border-none"
                    />
                    <span className="mx-1 text-gray-400">to</span>
                    <input
                      type="time"
                      value={shiftEnd}
                      onChange={(e) => setShiftEnd(e.target.value)}
                      className="text-xs outline-none border-none"
                    />
                  </div>

                  <div className="flex items-center border rounded-md px-2 py-1">
                    <label className="text-gray-600 mr-2">
                      Total break duration:
                    </label>
                    <span className="text-gray-800 font-medium">
                      {Math.floor(totalBreakMinutes / 60)}h{" "}
                      {totalBreakMinutes % 60}m
                    </span>
                  </div>
                </div>

                {/* Add Band / Break Section */}
                {!showBreak ? (
                  <button
                    onClick={() => setShowBreak(true)}
                    className="text-primary text-[11px] hover:underline"
                  >
                    + Add band/ break timings
                  </button>
                ) : (
                  <div className="mt-2 space-y-2">
                    {breaks.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gray-600">Break {idx + 1}:</span>
                        <input
                          type="time"
                          value={b.start}
                          onChange={(e) => {
                            const updated = [...breaks];
                            updated[idx].start = e.target.value;
                            setBreaks(updated);
                          }}
                          className="text-xs border rounded px-1 py-0.5"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={b.end}
                          onChange={(e) => {
                            const updated = [...breaks];
                            updated[idx].end = e.target.value;
                            setBreaks(updated);
                          }}
                          className="text-xs border rounded px-1 py-0.5"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddBreak}
                      className="text-[11px] text-primary hover:underline"
                    >
                      + Add another break
                    </button>
                  </div>
                )}

                {isBreakExceeding && (
                  <p className="text-red-500 text-[11px] mt-2">
                    ⚠️ Total break time exceeds total shift duration. Please
                    adjust break times.
                  </p>
                )}
              </div>
            </div>

            {/* Right Info Panel */}
            <div className="w-[280px] border-l bg-gray-50 p-5 text-gray-700 text-[11px] leading-relaxed">
              <h6 className="font-medium mb-2">What is fixed work hours?</h6>
              <p className="mb-3 text-xs">
                In a fixed shift, employees are required to work during specific
                hours. For example, 9:30 AM to 6:30 PM.
              </p>

              <h6 className="font-medium mb-2">What is flexible work hours?</h6>
              <p className="mb-3 text-xs">
                Flexible work hours mean employees can complete their required
                work within variable start or end times.
              </p>

              <h6 className="font-medium mb-2">
                Different timings for different days
              </h6>
              <p className="text-xs">
                For half-working days (like Saturday), you can assign unique
                timings accordingly.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
