import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Package } from "lucide-react";
import { useState } from "react";

export default function AppsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Apps");

  const categories = [
    "All Apps",
    "Training",
    "Payroll & Benefits",
    "Project Management",
    "Travel and Spend",
    "Time Tracking",
    "Rewards and Recognition",
    "Talent Management",
    "Document Management",
    "Hiring & Onboarding",
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm">
      <Tabs defaultValue="my-apps" className="w-full">
        <TabsList className="flex space-x-2 bg-gray-100 rounded-lg mb-4 text-sm">
          <TabsTrigger value="my-apps">My Apps</TabsTrigger>
          <TabsTrigger value="apps-center">Apps Center</TabsTrigger>
        </TabsList>

        {/* My Apps Tab */}
        <TabsContent value="my-apps">
          <Card className="shadow-sm border rounded-lg">
            <CardContent className="p-4">
              <div className="flex space-x-2 mb-3">
                <button className="px-3 py-1.5 border border-gray-300 rounded-md bg-blue-50 text-blue-700 font-medium text-sm">
                  Org Enabled
                </button>
                <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-600 text-sm">
                  Installed Apps
                </button>
              </div>

              <Input
                placeholder="Search for apps"
                className="mb-4 w-full border-gray-200 rounded-md text-sm"
              />

              <div className="text-center py-12 text-gray-500 text-sm">
                <div className="flex justify-center mb-3">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="font-medium">No apps to show</p>
                <p className="text-xs text-gray-400 mt-1">
                  Install apps by browsing through our catalogue
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apps Center Tab */}
        <TabsContent value="apps-center">
          <div className="grid grid-cols-12 gap-4">
            {/* Sidebar */}
            <div className="col-span-3 bg-white border rounded-lg p-3 h-fit shadow-sm">
              <h3 className="text-sm font-semibold mb-2">Categories</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                {categories.map((category) => (
                  <li
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1.5 cursor-pointer rounded-md transition text-sm ${
                      selectedCategory === category
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* App Grid */}
            <div className="col-span-9">
              <div className="flex items-center space-x-2 mb-3 text-sm">
                <Input
                  placeholder="Search for apps, services"
                  className="w-full border-gray-200 rounded-md text-sm"
                />
                <div className="flex items-center space-x-2">
                  <Globe className="text-gray-400 w-4 h-4" />
                  <select className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-600">
                    <option>All locations</option>
                  </select>
                  <Checkbox id="free" />
                  <label htmlFor="free" className="text-xs text-gray-600">Free</label>
                  <Checkbox id="pro" />
                  <label htmlFor="pro" className="text-xs text-gray-600">Pro</label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    name: "Zoom meeting for 1:1 checkins",
                    desc: "Create a meeting in Zoom through the 1:1 interface",
                  },
                  {
                    name: "Teams meeting for 1:1 checkins",
                    desc: "Seamlessly join meetings in Keka via Teams links.",
                  },
                  {
                    name: "Outlook Calendar for 1:1 checkins",
                    desc: "Optimize schedules with Outlook 365 integration.",
                  },
                  {
                    name: "Jira for Goals",
                    desc: "Automate goal progress updates with Jira integration.",
                  },
                  {
                    name: "Google Meet for 1:1 checkins",
                    desc: "Join scheduled Google Meet meetings via calendar.",
                  },
                  {
                    name: "Google Calendar for 1:1 checkins",
                    desc: "Optimize schedules with Google Calendar integration.",
                  },
                ].map((app, idx) => (
                  <Card
                    key={idx}
                    className="shadow-sm border rounded-md p-3 hover:shadow transition text-sm"
                  >
                    <h4 className="font-semibold text-sm mb-0.5">{app.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{app.desc}</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                      Free
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
