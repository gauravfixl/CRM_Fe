"use client"

import React, { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ExcelRow = Record<string, any>

export default function BulkEmployeeWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [excelData, setExcelData] = useState<ExcelRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])

  // Step 1: Upload Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json: ExcelRow[] = XLSX.utils.sheet_to_json(sheet)
      if (json.length > 0) {
        setExcelData(json)
        setColumns(Object.keys(json[0]))
      }
    }
    reader.readAsBinaryString(file)
  }

  // Step 2: Match Columns
  const handleMappingChange = (excelCol: string, field: string) => {
    setMapping((prev) => ({ ...prev, [excelCol]: field }))
  }

  // Step 3: Validate Data
  const validateData = () => {
    const seen = new Set()
    const duplicateErrors: string[] = []

    excelData.forEach((row, index) => {
      const empNo = row["Employee Number"]
      if (seen.has(empNo)) duplicateErrors.push(`Row ${index + 1}: Duplicate Employee Number ${empNo}`)
      seen.add(empNo)
    })

    setErrors(duplicateErrors)
  }

  return (
    <Card className="rounded-lg shadow-md h-[90vh] mb-10 overflow-hidden overflow-y-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          Import Employee Personal Details
          <button onClick={onClose} className="text-xs text-gray-500 hover:underline">Close</button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Step Indicators */}
        <div className="flex items-center space-x-4 text-xs">
          {["Upload Template", "Match Columns", "Preview Data"].map((label, i) => (
            <div key={i} className={`flex items-center space-x-1 ${step === i + 1 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
              <div className={`h-5 w-5 flex items-center justify-center rounded-full border ${step === i + 1 ? "bg-blue-600 text-white" : ""}`}>
                {i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">Upload an Excel sheet containing employee details.</p>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="text-xs" />
            {excelData.length > 0 && (
              <Button size="sm" onClick={() => setStep(2)}>Next: Match Columns</Button>
            )}
          </div>
        )}

        {/* Step 2: Match Columns */}
        {step === 2 && (
          <div>
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Excel Column</th>
                  <th className="border p-2 text-left">Map To</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{col}</td>
                    <td className="border p-2">
                      <Select onValueChange={(value) => handleMappingChange(col, value)}>
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee Number">Employee Number</SelectItem>
                          <SelectItem value="First Name">First Name</SelectItem>
                          <SelectItem value="Last Name">Last Name</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Mobile Number">Mobile Number</SelectItem>
                          <SelectItem value="Gender">Gender</SelectItem>
                          <SelectItem value="Date of Birth">Date of Birth</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>Back</Button>
              <Button size="sm" onClick={() => setStep(3)}>Next: Preview</Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview Data */}
        {step === 3 && (
          <div className="space-y-2">
            <Button size="sm" onClick={validateData}>Validate Data</Button>
            {errors.length > 0 ? (
              <div className="border border-red-300 bg-red-50 p-2 text-xs text-red-600 rounded">
                <strong>Errors Found:</strong>
                <ul className="list-disc ml-4">
                  {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-green-600">No errors found! Ready to import.</p>
            )}

            <div className="overflow-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="border p-1">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, i) => (
                    <tr key={i} className="border-t">
                      {columns.map((col) => (
                        <td key={col} className="border p-1">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-3">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>Back</Button>
              <Button size="sm" className="bg-blue-600 text-white">Complete Import</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
