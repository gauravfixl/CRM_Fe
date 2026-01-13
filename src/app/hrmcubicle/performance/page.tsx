"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Performance - Feedback</h1>
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="received">Praises Received</TabsTrigger>
          <TabsTrigger value="feedback-received">Feedback Received</TabsTrigger>
          <TabsTrigger value="praises-given">Praises Given</TabsTrigger>
          <TabsTrigger value="feedback-given">Feedback Given</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>
        <TabsContent
          value="received"
          className="h-64 rounded-md bg-card text-sm text-muted-foreground grid place-items-center"
        >
          No praises received — keep giving your best!
        </TabsContent>
      </Tabs>
    </div>
  )
}
