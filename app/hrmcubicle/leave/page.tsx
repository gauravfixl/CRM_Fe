"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LeavePage() {
  return (
    <div className="text-[13px] text-gray-700 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-semibold">Leave Summary</h1>
        <Button className="text-[12px] px-3 py-[4px] h-auto rounded-md">
          Request Leave
        </Button>
      </div>

      {/* === Pending Leave Requests === */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              🎉
            </div>
            <div>
              <p className="font-medium text-[13px] text-gray-800">
                Hurray! No pending leave requests
              </p>
              <p className="text-[11px] text-gray-500">
                Request leave using the button above.
              </p>
            </div>
          </div>
          <div className="text-[12px] text-gray-500">Jan 2025 - Dec 2025 ▾</div>
        </CardContent>
      </Card>

      {/* === Leave Stats === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Weekly Pattern */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-[13px] font-semibold text-gray-800">
              Weekly Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-end justify-between h-[60px]">
              {[50, 30, 15, 40, 25, 45, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-4 bg-purple-400 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[11px] text-gray-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d[0]}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consumed Leave Types */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-[13px] font-semibold text-gray-800">
              Consumed Leave Types
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[90px]">
            <div className="relative w-[70px] h-[70px]">
              <div className="absolute inset-0 rounded-full border-[6px] border-green-400"></div>
              <div className="absolute inset-[6px] rounded-full border-[6px] border-yellow-400"></div>
              <div className="absolute inset-[12px] rounded-full bg-white flex items-center justify-center text-[10px] font-medium text-gray-600">
                Leave
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-[13px] font-semibold text-gray-800">
              Monthly Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-end justify-between h-[60px]">
              {[0, 0, 10, 5, 0, 0, 20, 50, 30, 0, 0, 0].map((h, i) => (
                <div
                  key={i}
                  className="w-2 bg-cyan-400 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-gray-500">
              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === Leave Balances === */}
      <div>
        <h2 className="text-[13px] font-semibold mb-2">Leave Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: "Casual Leave", color: "bg-purple-400", value: 12 },
            { title: "Paid Leave", color: "bg-red-400", value: 8 },
            { title: "Unpaid Leave", color: "bg-yellow-400", value: 4 },
          ].map((leave, i) => (
            <Card key={i} className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-[13px] font-medium">
                  {leave.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-[10px] h-[10px] rounded-full ${leave.color}`}
                  ></div>
                  <span className="text-[12px] text-gray-600">Available</span>
                </div>
                <span className="text-[13px] font-semibold">{leave.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
