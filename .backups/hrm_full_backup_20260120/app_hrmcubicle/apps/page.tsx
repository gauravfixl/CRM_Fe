"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Apps</h1>
      <Tabs defaultValue="org" className="w-full">
        <TabsList>
          <TabsTrigger value="org">Org Enabled</TabsTrigger>
          <TabsTrigger value="installed">Installed apps</TabsTrigger>
        </TabsList>
        <TabsContent
          value="org"
          className="grid h-56 place-items-center rounded-md bg-card text-sm text-muted-foreground"
        >
          No apps to show — install apps by browsing the catalogue.
        </TabsContent>
        <TabsContent
          value="installed"
          className="grid h-56 place-items-center rounded-md bg-card text-sm text-muted-foreground"
        >
          You have not installed any apps yet.
        </TabsContent>
      </Tabs>
    </div>
  )
}
