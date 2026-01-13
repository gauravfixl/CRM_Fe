import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="p-6  mx-auto">
      <Card className="shadow-sm border rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Feedback</h2>
          <Tabs defaultValue="praises" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-gray-100 rounded-xl mb-6">
              <TabsTrigger value="praises">Praises Received</TabsTrigger>
              <TabsTrigger value="feedback-received">Feedback Received</TabsTrigger>
              <TabsTrigger value="praises-given">Praises Given</TabsTrigger>
              <TabsTrigger value="feedback-given">Feedback Given</TabsTrigger>
            </TabsList>

            <TabsContent value="praises" className="text-center">
              <div className="py-16 text-gray-500">
                <div className="flex justify-center mb-4">
                  <Trophy className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No praises received</p>
                <p className="text-sm text-gray-400 mt-1">
                  Keep giving your best, keep working hard
                </p>
              </div>
            </TabsContent>

            <TabsContent value="feedback-received" className="text-center text-gray-500 py-16">
              <p>No feedback received yet.</p>
            </TabsContent>

            <TabsContent value="praises-given" className="text-center text-gray-500 py-16">
              <p>No praises given yet.</p>
            </TabsContent>

            <TabsContent value="feedback-given" className="text-center text-gray-500 py-16">
              <p>No feedback given yet.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}