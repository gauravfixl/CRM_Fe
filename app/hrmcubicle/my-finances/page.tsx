"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function MyFinancesPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Finances - Summary</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Let's review your finances</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Salary details</li>
            <li>Payment Information</li>
            <li>PAN details</li>
            <li>Statutory details</li>
          </ul>
          <div>
            <Button onClick={() => router.push("/my-finances/summary")}>
              Review my finances
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
