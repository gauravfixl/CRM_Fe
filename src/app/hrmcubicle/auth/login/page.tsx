"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Lock, Mail, ArrowRight, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useToast } from "@/shared/components/ui/use-toast";
import axios from "@/lib/axios";

export default function HRMLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast({
                title: "Missing Information",
                description: "Please enter both email and password",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/hrm/auth/login", {
                email: formData.email,
                password: formData.password
            });

            const data = response.data;

            if (data.loginType === "DIRECT") {
                toast({
                    title: "Login Successful",
                    description: `Welcome to ${data.employee.organizationName}`,
                });
                router.push("/hrmcubicle");
            } else if (data.loginType === "MULTI_ORG") {
                // Store temp token and organizations for org selection
                sessionStorage.setItem("hrm_temp_token", data.tempToken);
                sessionStorage.setItem("hrm_orgs", JSON.stringify(data.organizations));
                router.push("/hrmcubicle/auth/select-org");
            } else if (data.loginType === "ONBOARDING_PENDING") {
                toast({
                    title: "Onboarding Required",
                    description: "Please complete your onboarding process",
                });
                router.push(data.redirectTo || "/hrmcubicle/preboarding");
            }
        } catch (error: any) {
            console.error("HRM Login error:", error);
            toast({
                title: "Login Failed",
                description: error?.response?.data?.message || "Invalid credentials or no HRM access",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:block space-y-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">HRM Cubicle</h1>
                                <p className="text-slate-600 font-medium">Workforce Management Platform</p>
                            </div>
                        </div>
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Access your employee portal to manage attendance, leaves, payroll, performance, and more.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: Shield, title: "Secure Access", desc: "Enterprise-grade security for your data" },
                            { icon: Users, title: "Team Collaboration", desc: "Connect with your team seamlessly" },
                            { icon: TrendingUp, title: "Performance Tracking", desc: "Monitor and improve your growth" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/60"
                            >
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-3 pb-6">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto lg:mx-0">
                                <Lock className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900">Employee Login</CardTitle>
                            <CardDescription className="text-slate-600">
                                Enter your credentials to access your HRM dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                        Work Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        "Signing in..."
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-slate-600">
                                        Forgot your password?{" "}
                                        <button
                                            type="button"
                                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
                                            onClick={() => toast({ title: "Contact IT Support", description: "Please reach out to your IT administrator for password reset" })}
                                        >
                                            Contact IT Support
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-slate-600 mt-6">
                        Need help? Contact your HR department or IT support
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
