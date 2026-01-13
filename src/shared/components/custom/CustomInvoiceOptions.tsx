"use client";

import { useState, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { CustomButton } from "@/components/custom/CustomButton";
import {
  FlatCard,
  FlatCardContent,
  FlatCardHeader,
  FlatCardTitle,
} from "@/components/custom/FlatCard";
import {
  CustomTooltip,
  CustomTooltipProvider,
  CustomTooltipTrigger,
  CustomTooltipContent,
} from "@/components/custom/CustomTooltip";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom/CustomDialog";
import InvoiceModal from "./invoice/ViewInvoiceModal";
import ConfirmModal from "./ConfirmationModal";

import {
  Share2,
  Printer,
  Edit2,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Bell,
} from "lucide-react";
import { showError } from "@/utils/toast";

interface InvoiceOptionsProps {
  formData: any;
  orgName: string;
  onConvertDraft: () => void;
  onCancelInvoice: () => void;
  onRestoreInvoice: () => void;
  onCopyInvoice: () => void;
  onRecordPayment: () => void;
  onSaveDraft?: (mode: "Draft") => void;
  isCreating?: boolean;
  currency: string;
  setCurrency: any;
  allCurrencies: any;
  onRecurring: any;
  onAddReminder: any;
  invoiceRef: React.RefObject<HTMLDivElement>;
  hideStatus: boolean;
  onToggleHideStatus: (newValue: boolean) => void;
}

export default function InvoiceOptions({
  invoiceRef,
  formData,
  orgName,
  onConvertDraft,
  onCancelInvoice,
  onRestoreInvoice,
  onCopyInvoice,
  onRecordPayment,
  onSaveDraft,
  isCreating = false,
  currency,
  setCurrency,
  allCurrencies,
  onRecurring,
  onAddReminder,
  hideStatus,
  onToggleHideStatus,
}: InvoiceOptionsProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [recurringChecked, setRecurringChecked] = useState(false);

  const isDraft = formData?.draft;
  const isCancelled = formData?.cancel;

  const isValid = useMemo(() => {
    if (!formData) return false;

    const hasItem =
      Array.isArray(formData.items) &&
      formData.items.length > 0 &&
      formData.items[0]?.itemName?.trim() !== "" &&
      formData.items[0]?.unitPrice > 0;

    const hasClient =
      !!formData.client?.firstName &&
      !!formData.client?.lastName &&
      /\S+@\S+\.\S+/.test(formData.client?.email ?? "") &&
      formData.client?.phone?.length === 10 &&
      !!formData.client?.address?.address1 &&
      !!formData.client?.address?.country;

    const hasFirm =
      !!formData.firm?.name &&
      !!formData.firm?.email &&
      !!formData.firm?.address?.address1 &&
      !!formData.firm?.address?.country;

    const hasDueDate = Boolean(formData.dueDate);

    return hasItem && hasClient && hasFirm && hasDueDate;
  }, [formData]);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
  });

  return (
    <>
      <FlatCard className="shadow-md">
        <FlatCardHeader>
          <FlatCardTitle className="text-sm">
            {isCreating ? "Options" : "Invoice Actions"}
          </FlatCardTitle>
        </FlatCardHeader>

        <FlatCardContent className="flex flex-col gap-1">
          {isCreating ? (
            <>
              <CustomButton
                className="w-full justify-between text-xs"
                variant="default"
                onClick={() => setShowPreview(true)}
              >
                Preview <Eye className="h-4 w-4" />
              </CustomButton>

              <CustomButton
                className="w-full justify-between text-xs"
                variant="default"
                onClick={() => setOpenConfirm(true)}
                disabled={!isValid}
              >
                Save Draft
              </CustomButton>

              <div className="flex items-center justify-between border rounded px-2 py-2 text-xs">
                <span>Select Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-20 text-center border rounded p-1 text-xs"
                >
                  {allCurrencies.map((cur: any) => (
                    <option key={cur.id} value={cur.name}>
                      {cur.name} ({cur.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border rounded px-2 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={recurringChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (!formData?.dueDate) {
                        showError("⚠️ Please select a due date before enabling recurring invoice");
                        return;
                      }
                      setRecurringChecked(true);
                      onRecurring?.();
                    } else {
                      setRecurringChecked(false);
                    }
                  }}
                />
                Recurring Invoice
              </div>

              <div className="flex items-center gap-2 border rounded px-2 py-2 text-xs"><input type="checkbox" /> Price Including Tax</div>
              <div className="flex items-center gap-2 border rounded px-2 py-2 text-xs"><input type="checkbox" /> Allow Partial Payment</div>
              <div className="flex items-center gap-2 border rounded px-2 py-2 text-xs">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) onAddReminder?.();
                  }}
                />
                Add Reminder
              </div>
            </>
          ) : (
            <>
              {!isDraft && (
                <CustomButton
                  className="w-full justify-between text-xs"
                  variant="secondary"
                  onClick={() => onToggleHideStatus(!hideStatus)}
                >
                  {hideStatus ? "Show Status" : "Hide Status"}
                  {hideStatus ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </CustomButton>
              )}
              {!isDraft && !isCancelled && (
                <CustomTooltipProvider>
                  <CustomTooltip>
                    <CustomTooltipTrigger asChild>
                      <CustomButton
                        className="w-full px-2 py-2 justify-between text-xs"
                        variant="default"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: "Invoice",
                              text: "Check this invoice",
                              url: `${window.location.origin}/${orgName}/dashboard/invoice/${formData?.id}`,
                            }).catch((err) => console.error("Share failed:", err));
                          } else {
                            navigator.clipboard.writeText(`${window.location.origin}/${orgName}/dashboard/invoice/${formData?.id}`);
                            alert("Invoice link copied to clipboard!");
                          }
                        }}
                      >
                        Share Invoice <Share2 className="h-4 w-4" />
                      </CustomButton>
                    </CustomTooltipTrigger>
                    <CustomTooltipContent>Share this invoice</CustomTooltipContent>
                  </CustomTooltip>
                </CustomTooltipProvider>
              )}

              <CustomButton
                className="w-full justify-between text-xs print:hidden"
                variant="default"
                onClick={() => handlePrint?.()}
              >
                Print Invoice <Printer className="h-4 w-4" />
              </CustomButton>

              {!isDraft && !isCancelled && (
                <CustomButton className="w-full justify-between text-xs" variant="default" onClick={onRecordPayment}>
                  Record Payment <Edit2 className="h-4 w-4" />
                </CustomButton>
              )}

              {isDraft && (
                <CustomButton className="w-full justify-between text-xs" variant="default" onClick={onConvertDraft}>
                  Convert Draft <RefreshCw className="h-4 w-4" />
                </CustomButton>
              )}

              {(formData?.status === "Draft" || formData?.status === "Pending" || formData?.status === "Overdue") && (
                <CustomButton asChild className="w-full justify-between text-xs" variant="default">
                  <a href={`/${orgName}/dashboard/invoice/edit/${formData?._id}`}>
                    {isDraft ? "Edit Draft" : "Edit Invoice"} <Edit2 className="h-4 w-4" />
                  </a>
                </CustomButton>
              )}

              {isCancelled && (
                <CustomButton className="w-full justify-between text-xs" variant="default" onClick={onRestoreInvoice}>
                  Restore Invoice <RefreshCw className="h-4 w-4" />
                </CustomButton>
              )}

              <CustomButton className="w-full justify-between text-xs" variant="default" onClick={onCopyInvoice}>
                Copy Invoice <Copy className="h-4 w-4" />
              </CustomButton>

              <CustomButton className="w-full justify-between text-xs" variant="default" onClick={() => onAddReminder?.()}>
                Reminders <Bell className="h-4 w-4" />
              </CustomButton>

              {(formData?.status === "Pending" || formData?.status === "Overdue") && !isDraft && (
                <CustomButton className="w-full justify-between text-xs" variant="destructive" onClick={() => setShowCancelConfirm(true)}>Cancel Invoice</CustomButton>
              )}
            </>
          )}
        </FlatCardContent>
      </FlatCard>

      <CustomDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <CustomDialogContent className="max-w-sm p-4 rounded-xl">
          <CustomDialogHeader><CustomDialogTitle className="text-base font-semibold">Cancel Invoice</CustomDialogTitle></CustomDialogHeader>
          <p className="text-sm text-gray-600 mt-2">Do you really want to cancel this invoice?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CustomButton variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)}>No</CustomButton>
            <CustomButton variant="destructive" size="sm" onClick={() => { setShowCancelConfirm(false); onCancelInvoice(); }}>Yes, Cancel</CustomButton>
          </div>
        </CustomDialogContent>
      </CustomDialog>

      <InvoiceModal open={showPreview} onClose={() => setShowPreview(false)} data={formData} />

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => { setOpenConfirm(false); onSaveDraft?.("Draft"); }}
        title="Save Draft"
        message="Are you sure you want to save this invoice as a draft?"
        confirmText="Save Draft"
      />
    </>
  );
}
