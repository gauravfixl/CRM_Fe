"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import OfferTemplatesPage from "./offer-templates/offertemplates";
import CandidatePortalHome from "./candidate-portal/candidatehome";

export default function SettingsPage() {
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Imagine where employees come to work inspired, feel safe, share a common purpose with peers and leaders, do their best work, and go home fulfilled. We are on a mission."
  );

  const [introQuestions, setIntroQuestions] = useState([
    "Intro",
    "About Yourself",
    "Your Superpower",
  ]);

  const [postOnWall, setPostOnWall] = useState(true);

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="welcome" className="space-y-4">
        <TabsList className="flex w-fit border-b bg-transparent rounded-none p-0">
          <TabsTrigger
            value="welcome"
            className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Welcome Page
          </TabsTrigger>
          <TabsTrigger
            value="offer"
            className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Offer Templates
          </TabsTrigger>
          <TabsTrigger
            value="portal"
            className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Candidate Portal
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Archived / Declined Reasons
          </TabsTrigger>
        </TabsList>

        {/* Welcome Page Content */}
        <TabsContent value="welcome" className="pt-4">
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            {/* Left Section */}
            <div className="space-y-6">
              {/* Welcome Message */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Welcome Message</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Give a brief introduction to the onboarding employee about
                    the organisation
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                </CardContent>
              </Card>

              {/* Employee Introduction */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Employee Introduction
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Create interesting profile pages for your employees by asking
                    them a maximum of 6 questions.
                  </p>
                </CardHeader>
                <CardContent>
                  {introQuestions.map((q, i) => (
                    <Input
                      key={i}
                      value={q}
                      onChange={(e) => {
                        const newQs = [...introQuestions];
                        newQs[i] = e.target.value;
                        setIntroQuestions(newQs);
                      }}
                      className="mb-2 text-sm"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs mt-2"
                    onClick={() => setIntroQuestions([...introQuestions, ""])}
                  >
                    + Add Question
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Onboarding Reachouts */}
              <Card>
                <CardHeader className="pb-2 flex justify-between items-center">
                  <CardTitle className="text-base">
                    Onboarding Reachouts
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-semibold text-pink-700">
                      TS
                    </div>
                    <div className="text-xs">
                      <p className="font-medium">Tarun Shah</p>
                      <p className="text-muted-foreground">
                        Customer Support Executive
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* My Team */}
              <Card>
                <CardHeader className="pb-2 flex justify-between items-center">
                  <CardTitle className="text-base">My Team</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 flex-wrap">
                    {["SM", "HG", "DK"].map((name) => (
                      <div
                        key={name}
                        className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700"
                      >
                        {name}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground font-semibold">
                      +2
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Team members, peers, and subordinates will be displayed here
                  </p>
                </CardContent>
              </Card>

              {/* Post on Wall */}
              <Card className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Post on wall</p>
                </div>
                <Switch
                  checked={postOnWall}
                  onCheckedChange={setPostOnWall}
                  className="scale-90"
                />
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button size="sm" className="text-xs">
              Preview
            </Button>
          </div>
        </TabsContent>

        {/* Other Tabs Placeholder */}
        <TabsContent value="offer">
          <div className="text-sm text-muted-foreground">
            <OfferTemplatesPage/>
          </div>
        </TabsContent>
        <TabsContent value="portal">
          <div className="text-sm text-muted-foreground">
          <CandidatePortalHome/>
          </div>
        </TabsContent>
        <TabsContent value="archived">
          <div className="text-sm text-muted-foreground">
            Archived / Declined reasons setup coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
