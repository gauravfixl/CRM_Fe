import React from "react"
import { cn } from "@/lib/utils"

type Column = {
  key: string
  label: string
  className?: string
}

type DataTableProps = {
  columns: Column[]
  data: Record<string, any>[]
  emptyMessage: string
}

export function DataTable({ columns, data, emptyMessage }: DataTableProps) {

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-muted-foreground">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-2 text-left font-medium", col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-b last:border-none">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    {row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
