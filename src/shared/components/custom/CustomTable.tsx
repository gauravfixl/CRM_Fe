import * as React from "react";
import { cn } from "@/lib/utils";

// Wrapper for scrollable table
const CustomTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full text-xs caption-bottom", className)}
      {...props}
    />
  </div>
));
CustomTable.displayName = "CustomTable";

// TableHeader
const CustomTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b border-border bg-muted/50 text-muted-foreground uppercase tracking-wider text-xs", className)}
    {...props}
  />
));
CustomTableHeader.displayName = "CustomTableHeader";

// TableBody
const CustomTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
CustomTableBody.displayName = "CustomTableBody";

// TableRow
const CustomTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
CustomTableRow.displayName = "CustomTableRow";

// TableHead
const CustomTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-8 px-2 text-left font-semibold align-middle text-zinc-700 dark:text-zinc-300 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
CustomTableHead.displayName = "CustomTableHead";

// TableCell
const CustomTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-2 py-1 align-middle text-zinc-900 dark:text-zinc-100 [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
CustomTableCell.displayName = "CustomTableCell";

// TableFooter
const CustomTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border bg-muted/50 font-medium text-xs [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
CustomTableFooter.displayName = "CustomTableFooter";

// TableCaption
const CustomTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-2 text-xs text-muted-foreground", className)}
    {...props}
  />
));
CustomTableCaption.displayName = "CustomTableCaption";

export {
  CustomTable,
  CustomTableHeader,
  CustomTableBody,
  CustomTableRow,
  CustomTableHead,
  CustomTableCell,
  CustomTableFooter,
  CustomTableCaption,
};
