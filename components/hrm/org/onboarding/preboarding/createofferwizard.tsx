// src/components/CreateOfferWizard.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import offerLetterTemplates from "../settings/offer-templates/data/offerlettertemplates";
import { toast } from "sonner";

interface CreateOfferWizardProps {
  open: boolean;
  onClose: () => void;
  candidate?: any;
  onOfferSent?: (candidate: any) => void; // ✅ new
}


export default function CreateOfferWizard({
  open,
  onClose,
  candidate,
  onOfferSent
}: CreateOfferWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [formData, setFormData] = useState({
    candidateName: candidate?.name || "", 
    jobTitle: "",
    department: "",
    location: "",
    joiningDate: "",
    salary: "",
    payGroup: "",
  });
  const [payItems, setPayItems] = useState({
    hra: false,
    basic: false,
    bonus: false,
  });

  if (!open) return null;

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value);
    setContent(offerLetterTemplates[value] || "");
  };
const handleSendOffer = () => {
  toast.success("Offer sent successfully!");
  onOfferSent?.(candidate); // ✅ notify parent
  onClose();
};


  const fadeUp = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            {...fadeUp}
            className="bg-white w-full h-full rounded-t-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-sm font-semibold">Create Offer</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                ✕
              </Button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 overflow-hidden relative">
              <AnimatePresence mode="wait">
         {step === 1 && (
  <motion.div
    key="step1"
    {...fadeUp}
    className="grid grid-cols-2 gap-6 h-full"
  >
    {/* LEFT SIDE – Job Details Form */}
    <div className="flex flex-col gap-5 bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-sm font-semibold">Job & Offer Details</h3>

      {/* Contact Information */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600">Contact Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Personal Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="text-xs rounded-md"
          />
          <Input
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="text-xs rounded-md"
          />
        </div>
        <p className="text-[11px] text-gray-500 border border-gray-100 bg-gray-50 rounded-md p-2">
          Candidate will receive an email/SMS invite when the offer is released.
          <span className="block text-blue-600 underline text-[11px] mt-1 cursor-pointer">
            Visit candidate experience portal
          </span>
        </p>
      </div>

      {/* Job Details */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600">Job Details</h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Legal Entity */}
          <Select
            onValueChange={(v) => setFormData({ ...formData, legalEntity: v })}
            value={formData.legalEntity}
          >
            <SelectTrigger className="text-xs h-8 rounded-md">
              <SelectValue placeholder="Legal Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test_accum">Test Accum</SelectItem>
              <SelectItem value="infinite_hr">Infinite HR</SelectItem>
            </SelectContent>
          </Select>

          {/* Reporting Manager */}
          <Input
            placeholder="Reporting Manager (optional)"
            value={formData.manager}
            onChange={(e) =>
              setFormData({ ...formData, manager: e.target.value })
            }
            className="text-xs rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            className="text-xs rounded-md"
          />

          <Select
            onValueChange={(v) => setFormData({ ...formData, workerType: v })}
            value={formData.workerType}
          >
            <SelectTrigger className="text-xs h-8 rounded-md">
              <SelectValue placeholder="Worker Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="text-xs rounded-md"
          />

          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="text-xs rounded-md"
          />
        </div>
      </div>

      {/* Offer Details */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600">Offer Details</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-600">Joining Date</label>
            <Input
              type="date"
              value={formData.joiningDate}
              onChange={(e) =>
                setFormData({ ...formData, joiningDate: e.target.value })
              }
              className="text-xs rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-600">Offer Valid Upto</label>
            <Input
              type="date"
              value={formData.offerValidTill}
              onChange={(e) =>
                setFormData({ ...formData, offerValidTill: e.target.value })
              }
              className="text-xs rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4">
        <Button
          onClick={nextStep}
          className="text-xs"
          disabled={
            !formData.jobTitle ||
            !formData.department ||
            !formData.location ||
            !formData.joiningDate
          }
        >
          Next
        </Button>
      </div>
    </div>

    {/* RIGHT SIDE – Candidate Preview */}
    <div className="border rounded-md shadow-sm p-4 bg-white flex flex-col gap-2">
      <h3 className="text-sm font-semibold mb-2">Candidate Details</h3>
      <div className="flex items-center gap-3 border-b pb-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
          {formData.candidateName
            ? formData.candidateName
                .split(" ")
                .map((n) => n[0])
                .join("")
            : "NA"}
        </div>
        <div>
          <p className="font-medium text-sm">
            {formData.candidateName || "Candidate Name"}
          </p>
          <p className="text-xs text-gray-500">
            {formData.jobTitle || "Job Title"}
          </p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <p>
          <span className="font-medium">Email ID:</span>{" "}
          {formData.email || "-"}
        </p>
        <p>
          <span className="font-medium">Phone Number:</span>{" "}
          {formData.phone || "-"}
        </p>
        <p>
          <span className="font-medium">Recruiter:</span>{" "}
          {formData.recruiter || "-"}
        </p>
        <p>
          <span className="font-medium">Source:</span>{" "}
          {formData.source || "-"}
        </p>
        <p>
          <span className="font-medium">Applied On:</span>{" "}
          {formData.appliedOn || "-"}
        </p>
      </div>
    </div>
  </motion.div>
)}


{step === 2 && (
  <motion.div
    key="step2"
    {...fadeUp}
    className="grid grid-cols-2 gap-6 h-full"
  >
    {/* LEFT SIDE – Compensation Setup */}
    <div className="flex flex-col gap-5 bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-sm font-semibold mb-1">Compensation</h3>

      {/* Eligibility Checkboxes */}
      <div className="flex flex-wrap gap-3">
        {["Eligible for PF", "Eligible for ESI", "Eligible for LWF"].map(
          (label, idx) => (
            <label key={idx} className="flex items-center gap-2 text-xs">
              <Checkbox />
              {label}
            </label>
          )
        )}
      </div>

      {/* Pay Group */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Pay Group</label>
        <Select
          onValueChange={(v) => setFormData({ ...formData, payGroup: v })}
          value={formData.payGroup}
        >
          <SelectTrigger className="text-xs h-8 rounded-md">
            <SelectValue placeholder="Select Pay Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TER-HERTZ">TER-HERTZ</SelectItem>
            <SelectItem value="INFINEON">INFINEON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Remuneration Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Remuneration Type
        </label>
        <Select
          onValueChange={(v) =>
            setFormData({ ...formData, remunerationType: v })
          }
          value={formData.remunerationType}
        >
          <SelectTrigger className="text-xs h-8 rounded-md">
            <SelectValue placeholder="Select Remuneration Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Annual Salary */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Salary (Annual basis)
        </label>
        <Input
          type="number"
          placeholder="Enter annual salary"
          value={formData.salary}
          onChange={(e) =>
            setFormData({
              ...formData,
              salary: e.target.value,
            })
          }
          className="text-xs rounded-md"
        />
      </div>

      {/* Structure Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Select structure type
        </label>
        <Select
          onValueChange={(v) =>
            setFormData({ ...formData, structureType: v })
          }
          value={formData.structureType}
        >
          <SelectTrigger className="text-xs h-8 rounded-md">
            <SelectValue placeholder="Range Based" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="range">Range Based</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Salary Structure Toggle */}
      <button
        type="button"
        onClick={() =>
          setFormData({ ...formData, showStructure: !formData.showStructure })
        }
        className="text-blue-600 text-xs mt-1 underline"
      >
        {formData.showStructure ? "Hide Salary Structure" : "View Salary Structure"}
      </button>

      {/* Bonus Section */}
      <div className="border-t pt-3 mt-2">
        <h4 className="text-xs font-semibold mb-2">
          Variable / Bonus Components
        </h4>
        <label className="flex items-center gap-2 text-xs mb-2">
          <Checkbox
            checked={formData.includeBonus}
            onCheckedChange={(v) =>
              setFormData({ ...formData, includeBonus: !!v })
            }
          />
          Bonus amount is included in the new salary
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-600"
          onClick={() => console.log("Add bonus clicked")}
        >
          + Add Bonus
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="text-xs" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={nextStep}
          size="sm"
          className="text-xs"
          disabled={!formData.salary}
        >
          Next
        </Button>
      </div>
    </div>

    {/* RIGHT SIDE – Salary Structure Preview */}
    <div className="border rounded-md shadow-sm p-4 bg-white overflow-y-auto">
      {formData.salary && formData.showStructure ? (
        <>
          <h3 className="text-sm font-semibold mb-2">Salary Structure</h3>
          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Details</th>
                <th className="p-2">Monthly</th>
                <th className="p-2">Annually</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Basic", val: 0.5 },
                { label: "HRA", val: 0.2 },
                { label: "Dearness Allowance", val: 0.17 },
                { label: "LTA / Cima", val: 0.1 },
                { label: "Transport Allowance", val: 0.016 },
                { label: "Car Washing", val: 0.01 },
              ].map((item, i) => (
                <tr key={i}>
                  <td className="p-2 border-t">{item.label}</td>
                  <td className="p-2 border-t">
                    ₹{((Number(formData.salary) * item.val) / 12).toFixed(2)}
                  </td>
                  <td className="p-2 border-t">
                    ₹{(Number(formData.salary) * item.val).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="p-2 border-t">TOTAL</td>
                <td className="p-2 border-t">
                  ₹{(Number(formData.salary) / 12).toFixed(2)}
                </td>
                <td className="p-2 border-t">₹{Number(formData.salary).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center mt-20 text-gray-400 text-xs">
          Add Annual Salary & click “View Salary Structure” to preview
        </p>
      )}
    </div>
  </motion.div>
)}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    {...fadeUp}
                    className="grid grid-cols-2 gap-6 h-full"
                  >
                    {/* LEFT */}
                    <div className="flex flex-col gap-3 text-xs">
                      <Select onValueChange={handleTemplateSelect}>
                        <SelectTrigger className="w-60 h-8 text-xs">
                          <SelectValue placeholder="Choose Offer Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Offer Letter
                          </SelectItem>
                          <SelectItem value="fulltime">
                            Full-time Offer Letter
                          </SelectItem>
                          <SelectItem value="government">
                            Government Offer Letter
                          </SelectItem>
                          <SelectItem value="freelancer">
                            Freelancer Offer Letter
                          </SelectItem>
                          <SelectItem value="internship">
                            Internship Offer Letter
                          </SelectItem>
                          <SelectItem value="internal">
                            Internal Offer Letter
                          </SelectItem>
                          <SelectItem value="remote">
                            Remote Offer Letter
                          </SelectItem>
                          <SelectItem value="international">
                            International Offer Letter
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs mt-1"
                      >
                        Upload Custom Offer Letter
                      </Button>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={nextStep}
                          size="sm"
                          className="text-xs"
                          disabled={!selectedTemplate}
                        >
                          Next
                        </Button>
                      </div>
                    </div>

                    {/* RIGHT PREVIEW */}
                    <div
                      className="border rounded-md p-4 text-xs overflow-y-auto bg-white"
                      dangerouslySetInnerHTML={{
                        __html:
                          offerLetterTemplates[selectedTemplate] ||
                          "<p class='text-center text-muted-foreground mt-20'>Select an offer letter template to preview</p>",
                      }}
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    {...fadeUp}
                    className="grid grid-cols-[2fr_1fr] gap-6 h-full"
                  >
                    {/* LEFT OFFER LETTER PREVIEW */}
                    <div className="border rounded-md bg-white p-6 text-sm overflow-y-auto">
                      <div className="flex items-center mb-6">
                        <img
                          src="/logo.png"
                          alt="Company Logo"
                          className="h-6"
                        />
                      </div>
                      <p>Congratulations {candidate?.name || "Aman"}!</p>
                      <p className="mt-2">
                        We are pleased to inform you that you are appointed as{" "}
                        <strong>{formData.jobTitle || "SME - Onboarding"}</strong>{" "}
                        with effective{" "}
                        <strong>{formData.joiningDate || "11 Jun 2024"}</strong>.
                      </p>
                      <p className="mt-3">
                        You would be a part of{" "}
                        <strong>{formData.department || "Onboarding"}</strong>.
                        <br />
                        Your annual salary would be{" "}
                        <strong>
                          INR {formData.salary || "12,00,000.00"}
                        </strong>
                        .
                      </p>
                      <p className="mt-3">
                        Your reporting manager would be{" "}
                        <strong>{candidate?.manager || "Sunil Inty"}</strong>.
                      </p>

                      <table className="w-full text-xs border mt-6">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">EARNINGS</th>
                            <th className="p-2 border">MONTHLY</th>
                            <th className="p-2 border">YEARLY</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border">Basic</td>
                            <td className="p-2 border">50,000.00</td>
                            <td className="p-2 border">6,00,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">HRA</td>
                            <td className="p-2 border">20,000.00</td>
                            <td className="p-2 border">2,40,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Dearness Allowance</td>
                            <td className="p-2 border">17,400.00</td>
                            <td className="p-2 border">2,08,800.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">LTA / Uma</td>
                            <td className="p-2 border">10,000.00</td>
                            <td className="p-2 border">1,20,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Transport Allowance</td>
                            <td className="p-2 border">1,600.00</td>
                            <td className="p-2 border">19,200.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border">Car Washing</td>
                            <td className="p-2 border">1,000.00</td>
                            <td className="p-2 border">12,000.00</td>
                          </tr>
                          <tr className="font-semibold">
                            <td className="p-2 border">TOTAL</td>
                            <td className="p-2 border">INR 1,00,000.00</td>
                            <td className="p-2 border">INR 12,00,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex flex-col text-xs border rounded-md bg-gray-50 p-4 overflow-y-auto">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Select a contact person for this offer
                        </h4>
                        <div className="flex items-center gap-2 border p-2 rounded-md mb-2 bg-white">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                            SI
                          </div>
                          <div>
                            <p className="font-medium text-sm">Sunil Inty</p>
                            <p className="text-muted-foreground text-xs">
                              Product Specialist
                            </p>
                          </div>
                        </div>
                        <div className="ml-10 text-xs text-muted-foreground space-y-1">
                          <div>9876543</div>
                          <div>topgunrando.msg@gmail.com</div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="font-semibold mb-2">
                          Offer Letter Approval
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Approval is not required
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t">
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={prevStep}
                          >
                            Back
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={handleSendOffer}
                          >
                            Send Offer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
