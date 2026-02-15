"use client"

import React from "react"

interface DynamicTableProps<T> {
  data: T[]
  fields?: (keyof T)[] // optional — show only these fields if provided
}

export default function EmployeeHoursTable<T extends Record<string, any>>({
  data,
  fields,
}: DynamicTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 border rounded-lg p-4">
        No data available
      </div>
    )
  }

  const columns = fields && fields.length > 0 ? fields : (Object.keys(data[0]) as (keyof T)[])

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-xs border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-600">
            {columns.map((col) => (
              <th key={String(col)} className="p-2 font-medium capitalize">
                {String(col).replace(/([A-Z])/g, " $1").trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={String(col)} className="p-2 text-gray-800">
                  {row[col] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
