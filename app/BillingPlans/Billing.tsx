
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {getAllBillingPlans} from "@/hooks/billingHooks";
import { useEffect } from "react";

type Plan = {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  price: number;
  billingCycle?: string;
  maxUsers?: number;
  maxStorageGB?: number;
  maxProjects?: number;
  maxProjectMembers?: number;
  trialDays?: number;
  modules?: string[];
  isActive?: boolean;
};


// const billingPlans: Plan[] = [
//   {
//     _id: "68301e4442efb7a75cb830bf",
//     name: "Enterprise",
//     description: "Full enterprise access with custom modules",
//     price: 999,
//     billingCycle: "monthly",
//     maxUsers: 100,
//     maxStorageGB: 500,
//     maxProjects: 5,
//     maxProjectMembers: 10,
//     trialDays: 0,
//     modules: ["all"],
//     isActive: true,
//   },
//   {
//     _id: "68301e5942efb7a75cb830c1",
//     name: "Pro Yearly",
//     description: "Yearly plan with discounted pricing",
//     price: 499,
//     billingCycle: "yearly",
//     maxUsers: 30,
//     maxStorageGB: 100,
//     maxProjects: 5,
//     maxProjectMembers: 10,
//     trialDays: 30,
//     modules: ["dashboard", "hr", "analytics"],
//     isActive: true,
//   },
//   {
//     _id: "68301e5e42efb7a75cb830c3",
//     name: "Pro Monthly",
//     description: "Monthly plan with all standard features",
//     price: 49,
//     billingCycle: "monthly",
//     maxUsers: 25,
//     maxStorageGB: 50,
//     maxProjects: 5,
//     maxProjectMembers: 10,
//     trialDays: 14,
//     modules: ["dashboard", "sales", "crm"],
//     isActive: true,
//   },
//   {
//     _id: "68301e6442efb7a75cb830c5",
//     name: "Free Plan",
//     description: "Basic access with limited modules and usage limits.",
//     price: 0,
//     billingCycle: "lifetime",
//     maxUsers: 3,
//     maxStorageGB: 1,
//     maxProjects: 5,
//     maxProjectMembers: 10,
//     trialDays: 0,
//     modules: ["dashboard", "leads", "invoices"],
//     isActive: true,
//   },
// ];

export default function BillingPlansPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // selected on main page (visual highlight)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPlan, setDialogPlan] = useState<Plan | null>(null); // null => show list of names
  const [billingPlans, setBillingPlans] = useState<Plan[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchBillingPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllBillingPlans();
      setBillingPlans(response.data.data); // assuming API returns array in response.data
    } catch (err: any) {
      console.error("Error fetching billing plans:", err);
      setError("Failed to load billing plans");
    } finally {
      setLoading(false);
    }
  };

  fetchBillingPlans();
}, []);

  const openCreateDialog = () => {
    setDialogPlan(null); // ensure list view
    setDialogOpen(true);
  };

  const handlePlanNameClick = (plan: Plan) => {
    setDialogPlan(plan); // show details inside the dialog
  };

  const handleSelectThisPlan = (plan: Plan) => {
    // replace this with real flow: create workspace, POST, or redirect
    setSelectedPlanId(plan._id);
    setDialogOpen(false);
    alert(`Plan selected: ${plan.name}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Billing Plans</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Create</Button>
          </DialogTrigger>

          <DialogContent
            // keep it compact, scrollable
            className="w-full sm:w-[520px] max-h-[80vh] overflow-y-auto"
          >
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>
                {dialogPlan ? `Plan: ${dialogPlan.name}` : "Choose a Plan"}
              </DialogTitle>

              <div className="flex items-center gap-2">
                {dialogPlan && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialogPlan(null)}
                  >
                    Back
                  </Button>
                )}
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>

            {/* LIST VIEW: only names */}
            {!dialogPlan ? (
              <div className="flex flex-col gap-2 mt-4">
                {billingPlans.map((plan) => (
                  <button
                    key={plan._id}
                    onClick={() => handlePlanNameClick(plan)}
                    className="w-full text-left p-3 rounded-md border hover:shadow-sm transition flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-500">
                        {plan.description}
                      </div>
                    </div>
                    <div className="text-sm">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}{" "}
                      <span className="text-gray-400">/ {plan.billingCycle}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* DETAILS VIEW: only shown after user clicks a name inside dialog */
              <div className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {dialogPlan.name}
                      {dialogPlan.isActive && (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{dialogPlan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <span className="text-2xl font-semibold">
                        {dialogPlan.price === 0 ? "Free" : `$${dialogPlan.price}`}
                      </span>
                      <span className="text-gray-500"> / {dialogPlan.billingCycle}</span>
                    </div>

                    <ul className="text-sm mb-3 space-y-1">
                      <li>👥 Max Users: {dialogPlan.maxUsers ?? "-"}</li>
                      <li>📦 Storage: {dialogPlan.maxStorageGB ?? "-"} GB</li>
                      <li>📂 Projects: {dialogPlan.maxProjects ?? "-"}</li>
                      <li>🧑‍🤝‍🧑 Members per Project: {dialogPlan.maxProjectMembers ?? "-"}</li>
                      {dialogPlan.trialDays ? <li>🎁 Trial: {dialogPlan.trialDays} days</li> : null}
                    </ul>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleSelectThisPlan(dialogPlan)}
                      >
                        Select This Plan
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setDialogPlan(null)}
                      >
                        Back to List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* FULL SCREEN: show all plan details here (cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {billingPlans.map((plan) => (
          <Card
            key={plan._id}
            className={
              selectedPlanId === plan._id ? "border-2 border-blue-500" : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.isActive && <Badge variant="outline">Active</Badge>}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-3">
                <span className="text-2xl font-semibold">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                <span className="text-gray-500"> / {plan.billingCycle}</span>
              </div>

              <ul className="mb-4 text-sm space-y-1">
                <li>👥 Max Users: {plan.maxUsers}</li>
                <li>📦 Storage: {plan.maxStorageGB} GB</li>
                <li>📂 Projects: {plan.maxProjects}</li>
                <li>🧑‍🤝‍🧑 Members per Project: {plan.maxProjectMembers}</li>
                {plan.trialDays > 0 && <li>🎁 Trial: {plan.trialDays} days</li>}
              </ul>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setSelectedPlanId(plan._id)}>
                  {selectedPlanId === plan._id ? "Selected" : "Choose Plan"}
                </Button>
                {/* <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setDialogPlan(plan); // open dialog directly into details if they click from main page
                    setDialogOpen(true);
                  }}
                >
                  View in Dialog
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
