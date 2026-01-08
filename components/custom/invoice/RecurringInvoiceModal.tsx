"use client";

import { useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom/CustomDialog";
import { CustomButton } from "@/components/custom/CustomButton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function RecurringInvoiceModal({
  open,
  onClose,
  onSave,
}: RecurringInvoiceModalProps) {
  const [frequency, setFrequency] = useState("Every Week");
  const [invoiceDue, setInvoiceDue] = useState("In 10 days");
  const [isCustom, setIsCustom] = useState(false);
  const [customRepeat, setCustomRepeat] = useState(2);
  const [customFrequency, setCustomFrequency] = useState("Weeks");

  const handleSave = () => {
    onSave({
      frequency,
      invoiceDue,
      isCustom,
      customRepeat,
      customFrequency,
    });
    onClose();
  };

  return (
    <CustomDialog open={open} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-md rounded-xl">
        <CustomDialogHeader>
          <CustomDialogTitle className="text-base font-semibold">
            Recurring Invoice
          </CustomDialogTitle>
        </CustomDialogHeader>

        {/* Top dropdowns */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="border rounded px-2 py-2 text-sm"
            >
              <option>Every Week</option>
              <option>Every Month</option>
              <option>Every Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Invoice Due</label>
            <select
              value={invoiceDue}
              onChange={(e) => setInvoiceDue(e.target.value)}
              className="border rounded px-2 py-2 text-sm"
            >
              <option>On Receipt</option>
              <option>In 7 days</option>
              <option>In 10 days</option>
              <option>In 30 days</option>
            </select>
          </div>
        </div>

        {/* Custom Section */}
        <div className="flex items-center mt-4 space-x-2">
          <Checkbox
            checked={isCustom}
            onCheckedChange={(checked) => setIsCustom(!!checked)}
          />
          <span className="text-sm font-medium">Custom</span>
        </div>

        {isCustom && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Repeat Every</label>
                <Input
                  type="number"
                  value={customRepeat}
                  onChange={(e) => setCustomRepeat(Number(e.target.value))}
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Frequency</label>
                <select
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(e.target.value)}
                  className="border rounded px-2 py-2 text-sm"
                >
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                  <option>Years</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <CustomButton variant="default" onClick={handleSave}>
            Save
          </CustomButton>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
