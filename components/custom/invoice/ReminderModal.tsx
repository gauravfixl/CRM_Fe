"use client";

import { useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom/CustomDialog";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Textarea } from "@/components/ui/textarea";

interface Reminder {
  text: string;
  date: string;
  time: string;
}

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  invoice?: { reminders?: Reminder[] }; // 👈 optional now
}

export default function ReminderModal({
  open,
  onClose,
  onSave,
  invoice,
}: ReminderModalProps) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    if (!text.trim() || !date || !time) {
      alert("⚠️ Please fill all fields");
      return;
    }

    const newReminder = { text, date, time };
    onSave(newReminder);

    // reset form
    setText("");
    setDate("");
    setTime("");
  };

  return (
    <CustomDialog open={open} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-lg rounded-xl">
        <CustomDialogHeader>
          <CustomDialogTitle className="text-base font-semibold">
            Reminders
          </CustomDialogTitle>
        </CustomDialogHeader>

        {/* Input Fields */}
        <div className="grid grid-cols-3 gap-4 mt-4 items-stretch">
          {/* Left: Text Area (70%) */}
          <div className="col-span-2">
            <Textarea
              placeholder="Enter reminder..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 h-[100%] text-sm"
            />
          </div>

          {/* Right: Date + Time stacked (30%) */}
          <div className="flex flex-col gap-3 h-full justify-between">
            <CustomInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm"
            />
            <CustomInput
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-center mt-6">
          <CustomButton
            variant="default"
            onClick={handleSave}
            className="w-full"
          >
            Add
          </CustomButton>
        </div>

        {/* Existing Reminders List (only if invoice exists) */}
        {invoice?.reminders && invoice.reminders.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium">Existing Reminders</h4>
            <ul className="space-y-2">
              {invoice.reminders.map((reminder, idx) => (
                <li
                  key={idx}
                  className="border rounded p-2 text-sm flex flex-col gap-1 bg-gray-50"
                >
                  <p className="text-gray-800">{reminder.text}</p>
                  <p className="text-xs text-gray-600">
                    📅 {reminder.date} ⏰ {reminder.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CustomDialogContent>
    </CustomDialog>
  );
}
