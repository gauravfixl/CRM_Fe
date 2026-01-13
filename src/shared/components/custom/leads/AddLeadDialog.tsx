"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";

// Example: fetch firms from API
const fetchFirms = async () => {
  // Replace with your API call
  return [
    { id: "68a8470f27e096e2ec2c3374", name: "Doe Enterprises" },
    { id: "68a8470f27e096e2ec2c3375", name: "Acme Corp" }
  ];
};

export default function AddLeadDialog() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [firms, setFirms] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    firm: "",
    contact: {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      firmId: "",
      client: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        }
      },
      source: "",
      sourceDetails: ""
    },
    stage: "New",
    estimatedValue: 0,
    currency: "INR",
    assignedTo: "",
    nextAction: "",
    nextActionDate: "",
    priority: "Medium",
    notes: [],
    tags: [],
    customFields: {
      industry: "",
      region: ""
    }
  });

  useEffect(() => {
    fetchFirms().then(setFirms);
  }, []);

  const handleAddLead = async () => {
    const payload = {
      ...formData,
      contact: {
        ...formData.contact,
        firmId: formData.firm
      },
      stageHistory: [{ stage: formData.stage, enteredAt: new Date().toISOString() }],
      assignedAt: new Date().toISOString()
    };

    console.log("Payload to send:", payload);

    // Call your API
    // await api.post("/leads", payload);
    setIsAddDialogOpen(false);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Create a new lead to track potential customers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Lead title & description */}
          <div className="space-y-2">
            <Label htmlFor="title">Lead Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="New Enterprise Lead"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Potential high-value client from referral."
            />
          </div>

          {/* Firm selection */}
          <div className="space-y-2">
            <Label htmlFor="firm">Firm *</Label>
            <Select
              value={formData.firm}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, firm: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent>
                {firms.map(firm => (
                  <SelectItem key={firm.id} value={firm.id}>
                    {firm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contact.name}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, contact: { ...prev.contact, name: e.target.value } }))
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))
                }
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, contact: { ...prev.contact, phone: numericValue } }));
                }}
                placeholder="9876543210"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactCompany">Company</Label>
              <Input
                id="contactCompany"
                value={formData.contact.company}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, contact: { ...prev.contact, company: e.target.value } }))
                }
                placeholder="Doe Enterprises"
              />
            </div>
          </div>

          {/* Stage & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["New", "Qualified", "Proposal", "Negotiation"].map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value</Label>
              <Input
                id="estimatedValue"
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: Number(e.target.value) }))}
                placeholder="100000"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddLead}>Add Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
