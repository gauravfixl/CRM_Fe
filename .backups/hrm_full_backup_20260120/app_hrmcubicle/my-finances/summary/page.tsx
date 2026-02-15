"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PayrollSummaryPage() {
  return (
    <div className="space-y-4 text-[13px] text-gray-700">
      {/* Payroll Summary */}
      <Card className="border shadow-none rounded-none">
        <CardHeader className="pb-1">
          <div className="flex justify-between items-start">
            <CardTitle className="text-[14px] font-semibold">Payroll Summary</CardTitle>
            <div className="text-right text-xs space-y-1">
              <p className="text-gray-500">Last Processed Cycle</p>
              <p className="font-medium text-gray-800">Aug 2025 (01 Aug - 31 Aug)</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-y-1 text-xs">
          <div>
            <p className="text-gray-500">Working Days</p>
            <p className="font-semibold text-gray-800">5</p>
          </div>
          <div>
            <p className="text-gray-500">Loss of Pay</p>
            <p className="font-semibold text-gray-800">0</p>
          </div>
          <div className="col-span-2 text-right">
            <a href="#" className="text-blue-600 hover:underline text-xs font-medium">
              View Payslip
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Payment + Identity Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Info */}
        <Card className="border shadow-none rounded-none">
          <CardHeader className="pb-1 border-b">
            <CardTitle className="text-[13px] font-semibold">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3 text-[13px]">
            <div>
              <p className="text-gray-500 text-xs mb-1">Salary Payment Mode</p>
              <p className="font-medium text-gray-800">Bank Transfer</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Bank Information</p>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <p className="text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-800">Bank of Baroda</p>

                <p className="text-gray-500">Account Number</p>
                <p className="font-medium text-gray-800">29118100005864</p>

                <p className="text-gray-500">IFSC Code</p>
                <p className="font-medium text-gray-800">BARB0MALJAI</p>

                <p className="text-gray-500">Name on Account</p>
                <p className="font-medium text-gray-800">Pooja Harplani</p>

                <p className="text-gray-500">Branch</p>
                <p className="font-medium text-gray-800">N/A</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity Info */}
        <Card className="border shadow-none rounded-none">
          <CardHeader className="pb-1 border-b">
            <CardTitle className="text-[13px] font-semibold">Identity Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-[13px] space-y-2">
            <div className="flex items-center space-x-2">
              <img src="/india-flag.png" alt="Flag" className="w-5 h-3" />
              <p className="font-medium text-gray-800">PAN Card</p>
              <span className="text-green-700 text-xs bg-green-100 px-2 py-0.5 rounded">VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 gap-y-1 text-xs mt-2">
              <p className="text-gray-500">Permanent Account Number</p>
              <p className="font-medium text-gray-800">XXXXXX992Q</p>

              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-800">Pooja Harplani</p>

              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">19 Aug 2004</p>

              <p className="text-gray-500">Parent's Name</p>
              <p className="font-medium text-gray-800">Not Available</p>
            </div>

            <div className="mt-3 text-xs">
              <p className="font-semibold">Photo ID</p>
              <p className="font-semibold mt-1">Address Proof</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
