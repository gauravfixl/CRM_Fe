"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { ShoppingBag, Box, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MarketplacePage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Module Marketplace"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Marketplace", href: "/modules/settings/marketplace" }
                ]}
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-none p-8 text-white mb-6">
                    <h2 className="text-3xl font-black mb-2">Extend your platform</h2>
                    <p className="text-indigo-200 text-sm max-w-xl mb-6">Discover powerful add-ons, integrations, and modules built by our team and partners.</p>
                    <Button className="bg-white text-indigo-900 hover:bg-zinc-100 font-bold rounded-none">Browse All Apps</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Advanced Analytics", desc: "Deep dive into your sales and performance data with AI-powered insights.", icon: Box, price: "Paid" },
                        { title: "eSignature Pro", desc: "Legally binding electronic signatures directly within your quotes and contracts.", icon: ShoppingBag, price: "Paid" },
                        { title: "Slack Integration", desc: "Seamlessly push notifications and updates to your team's Slack channels.", icon: Box, price: "Free" },

                    ].map((app, i) => (
                        <Card key={i} className="rounded-none border-0 shadow-sm bg-white hover:shadow-md transition-all group">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <app.icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant={app.price === "Free" ? "secondary" : "default"} className="rounded-none">{app.price}</Badge>
                                </div>
                                <CardTitle className="text-lg font-bold mt-4">{app.title}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10">{app.desc}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between hover:bg-zinc-50 rounded-none group-hover:text-indigo-600">
                                    View Details <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
