import { Card, CardContent } from "@/components/ui/card"

export default function ExpensesTravelPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Expenses & Travel</h1>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border-l-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Expense policy is not assigned yet. Please contact your HR administration to assign Expense policy.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
