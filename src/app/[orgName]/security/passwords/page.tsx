"use client";

import React, { useState } from "react";
import { Save, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { showSuccess, showWarning } from "@/utils/toast";

export default function PasswordPoliciesPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [policies, setPolicies] = useState({
        minLength: "12",
        requireSpecial: true,
        requireNumbers: true,
        requireUpper: true,
        expirationDays: "90",
        historyCheck: "5",
        blockPwned: true,
    });

    const handleSave = () => {
        const minLen = parseInt(policies.minLength);
        const expDays = parseInt(policies.expirationDays);
        const histCheck = parseInt(policies.historyCheck);

        if (isNaN(minLen) || minLen < 8 || minLen > 64) {
            showWarning("Minimum length must be between 8 and 64 characters");
            return;
        }

        if (isNaN(expDays) || expDays < 0 || expDays > 365) {
            showWarning("Expiration days must be between 0 and 365");
            return;
        }

        if (isNaN(histCheck) || histCheck < 0 || histCheck > 20) {
            showWarning("History check must be between 0 and 20");
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showSuccess("Password policies saved successfully");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Password policies
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Configure password complexity, expiration, and security requirements.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-none bg-primary hover:bg-primary/90 text-sm h-9 gap-2 px-5"
                >
                    <Save size={14} />
                    {isSaving ? "Saving..." : "Save changes"}
                </Button>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Complexity Requirements */}
                    <div className="bg-white border border-gray-200 rounded-none p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-5">
                            Complexity requirements
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">
                                    Minimum length
                                </Label>
                                <Input
                                    type="number"
                                    value={policies.minLength}
                                    onChange={(e) =>
                                        setPolicies({ ...policies, minLength: e.target.value })
                                    }
                                    className="rounded-none h-9 text-sm max-w-[200px]"
                                />
                                <p className="text-xs text-gray-400">
                                    Recommended: 12 or more
                                </p>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <Label className="text-xs font-medium text-gray-600">
                                    Require special characters
                                </Label>
                                <Switch
                                    checked={policies.requireSpecial}
                                    onCheckedChange={(v) =>
                                        setPolicies({ ...policies, requireSpecial: v })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <Label className="text-xs font-medium text-gray-600">
                                    Require numbers
                                </Label>
                                <Switch
                                    checked={policies.requireNumbers}
                                    onCheckedChange={(v) =>
                                        setPolicies({ ...policies, requireNumbers: v })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <Label className="text-xs font-medium text-gray-600">
                                    Require uppercase letters
                                </Label>
                                <Switch
                                    checked={policies.requireUpper}
                                    onCheckedChange={(v) =>
                                        setPolicies({ ...policies, requireUpper: v })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expiration & History */}
                    <div className="bg-white border border-gray-200 rounded-none p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-5">
                            Expiration & history
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">
                                    Password expiration days
                                </Label>
                                <Input
                                    type="number"
                                    value={policies.expirationDays}
                                    onChange={(e) =>
                                        setPolicies({ ...policies, expirationDays: e.target.value })
                                    }
                                    className="rounded-none h-9 text-sm"
                                />
                                <p className="text-xs text-gray-400">
                                    Set to 0 for no expiration
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">
                                    Password history check
                                </Label>
                                <Input
                                    type="number"
                                    value={policies.historyCheck}
                                    onChange={(e) =>
                                        setPolicies({ ...policies, historyCheck: e.target.value })
                                    }
                                    className="rounded-none h-9 text-sm"
                                />
                                <p className="text-xs text-gray-400">
                                    Users cannot reuse last N passwords
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column (sidebar) */}
                <div className="space-y-6">
                    {/* Threat Protection */}
                    <div className="bg-white border border-gray-200 rounded-none p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">
                                Threat protection
                            </h3>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-600">
                                    Block compromised passwords
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Check against known breach databases
                                </p>
                            </div>
                            <Switch
                                checked={policies.blockPwned}
                                onCheckedChange={(v) =>
                                    setPolicies({ ...policies, blockPwned: v })
                                }
                            />
                        </div>
                    </div>

                    {/* Compliance */}
                    <div className="bg-white border border-gray-200 rounded-none p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Info size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">
                                Compliance
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Policies comply with NIST 800-63B standards for digital identity and authentication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
