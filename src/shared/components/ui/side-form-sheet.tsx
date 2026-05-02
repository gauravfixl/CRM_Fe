"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./sheet";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type SheetWidth = "sm" | "md" | "lg" | "xl";

const widthMap: Record<SheetWidth, string> = {
  sm: "sm:max-w-[420px]",
  md: "sm:max-w-[500px]",
  lg: "sm:max-w-[580px]",
  xl: "sm:max-w-[720px]",
};

interface SideFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  submitDisabled?: boolean;
  width?: SheetWidth;
  footer?: React.ReactNode;
  hideFooter?: boolean;
  accentColor?: string;
}

export function SideFormSheet({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  submitDisabled = false,
  width = "md",
  footer,
  hideFooter = false,
  accentColor = "#2563eb",
}: SideFormSheetProps) {
  const reactId = React.useId();
  const formId = `side-form-${reactId.replace(/:/g, "")}`;

  // Radix bug workaround: when a Sheet/Dialog is opened via a DropdownMenu item,
  // `pointer-events: none` can remain stuck on document.body after close,
  // freezing the whole page. Force-clear it after the close animation settles.
  React.useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [open]);

  const content = (
    <>
      <div className="flex items-start gap-3 px-6 pt-6 pb-5 border-b border-[#EEF1F6] bg-white">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 4px 12px ${accentColor}33`,
            }}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0 pr-6">
          <SheetTitle className="text-[17px] font-semibold text-[#0F172A] leading-tight">
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-[13px] text-[#64748B] mt-1 leading-snug">
              {description}
            </SheetDescription>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

      {!hideFooter && (
        <div className="px-6 py-4 border-t border-[#EEF1F6] bg-[#FAFBFC] flex items-center justify-end gap-2">
          {footer !== undefined ? (
            footer
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                form={formId}
                disabled={loading || submitDisabled}
                className="h-10 px-5 rounded-lg text-white hover:brightness-110 transition-all"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 4px 12px ${accentColor}33`,
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  submitLabel
                )}
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full p-0 flex flex-col gap-0 bg-white",
          widthMap[width]
        )}
      >
        {onSubmit ? (
          <form
            id={formId}
            onSubmit={onSubmit}
            className="flex flex-col h-full"
          >
            {content}
          </form>
        ) : (
          content
        )}
      </SheetContent>
    </Sheet>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, required, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[13px] font-semibold text-[#374151] flex items-center gap-0.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11.5px] text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11.5px] text-[#9CA3AF] mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
