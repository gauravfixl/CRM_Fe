"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddShiftWeeklyOffRulesWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function AddShiftWeeklyOffRulesWizard({
  open,
  onClose,
  onSave,
}: AddShiftWeeklyOffRulesWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shiftAssignment: false,
    weeklyOff: false,
    settings: {},
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/30 z-50 flex justify-center items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Wizard Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="bg-white w-full h-full rounded-t-2xl shadow-lg flex flex-col text-xs overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-medium text-sm text-gray-800">
                Shift & Weekly Off Rules
              </h2>
              <button onClick={onClose}>
                <X className="w-4 h-4 text-gray-500 hover:text-primary" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-6 py-3 border-b text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]",
                    step === 1 ? "bg-primary" : "bg-gray-300"
                  )}
                >
                  1
                </div>
                <span
                  className={cn(
                    step === 1 ? "text-primary font-medium" : "text-gray-500"
                  )}
                >
                  Basic Information
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]",
                    step === 2 ? "bg-primary" : "bg-gray-300"
                  )}
                >
                  2
                </div>
                <span
                  className={cn(
                    step === 2 ? "text-primary font-medium" : "text-gray-500"
                  )}
                >
                  Settings
                </span>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="flex-1 p-6 space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Name</p>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border rounded-md w-1/3 p-2 text-xs"
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Description</p>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border rounded-md w-1/3 p-2 text-xs h-16"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Settings */}
            {step === 2 && (
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.shiftAssignment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shiftAssignment: e.target.checked,
                        })
                      }
                    />
                    <span className="text-gray-700">
                      Shift assignment (on weekly off or holidays) and shift
                      change can be requested by employees.
                    </span>
                  </label>
                </div>

                <div className="space-y-2 ml-5">
                  <p className="font-medium text-gray-700">Shift Rules</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            allow3Days: !formData.settings?.allow3Days,
                          },
                        })
                      }
                    />
                    <p>An employee is allowed to raise shift request for 3 days weekly.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            requiresApproval: !formData.settings?.requiresApproval,
                          },
                        })
                      }
                    />
                    <p>Requires approval if exceeds limit.</p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.weeklyOff}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weeklyOff: e.target.checked,
                        })
                      }
                    />
                    <span className="text-gray-700">
                      Weekly off can be requested by employees.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 border-t p-4">
              {step === 2 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="text-xs px-3 py-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={step === 1 ? handleNext : handleSave}
                className="bg-primary hover:bg-primary text-xs px-4 py-1 text-white"
              >
                {step === 1 ? "Save & Continue" : "Save & Close"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
