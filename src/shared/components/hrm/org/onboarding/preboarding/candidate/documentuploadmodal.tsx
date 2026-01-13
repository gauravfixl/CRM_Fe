"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import StatusDropdown from "./statusdropdown";

export default function DocumentUploadModal({ task, onClose, onStatusChange }) {
  const [status, setStatus] = useState(task?.status || "");
  const [activeTab, setActiveTab] = useState("aadhaar");
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] || {}),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [activeTab]: file,
      }));
    }
  };

  const handleSave = () => {
    console.log("✅ Saved Data:", {
      documentType: activeTab,
      details: formData[activeTab],
      file: uploadedFiles[activeTab],
    });
    alert(`${activeTab.toUpperCase()} details saved successfully!`);
  };

  const handleSubmit = () => {
    console.log("📤 Submitting Task with Data:", { formData, uploadedFiles });
    alert("Task submitted successfully!");
    onStatusChange(task.id, "Submitted");
    onClose();
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-lg p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-3 flex justify-between items-center">
          <DialogTitle className="font-medium text-sm">{task?.name}</DialogTitle>
          <div className="flex items-center gap-3">
            <StatusDropdown value={status} onChange={setStatus} />
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-5 bg-transparent border-b text-xs font-medium">
              <TabsTrigger value="aadhaar" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Aadhaar Card
              </TabsTrigger>
              <TabsTrigger value="pan" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                PAN Card
              </TabsTrigger>
              <TabsTrigger value="voter" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Voter ID Card
              </TabsTrigger>
              <TabsTrigger value="dl" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Driving License
              </TabsTrigger>
              <TabsTrigger value="passport" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Passport
              </TabsTrigger>
            </TabsList>

            {/* Aadhaar Form */}
            <TabsContent value="aadhaar" className="mt-4 space-y-3">
              <FormSection title="Aadhaar Card">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Address" placeholder="Your complete residential address"
                    onChange={(e) => handleInputChange("address", e.target.value)} />
                  <SelectField label="Gender" options={["Male", "Female", "Other"]}
                    onChange={(e) => handleInputChange("gender", e.target.value)} />
                  <Field label="Enrollment Number" placeholder="Enter Enrolment Number"
                    onChange={(e) => handleInputChange("enrollment", e.target.value)} />
                  <Field label="Date of Birth" type="date"
                    onChange={(e) => handleInputChange("dob", e.target.value)} />
                  <Field label="Aadhaar Number" placeholder="Aadhaar Number"
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)} />
                  <Field label="Name" placeholder="Full Name"
                    onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>
                <UploadBox label="Aadhaar Card" file={uploadedFiles["aadhaar"]} onUpload={handleFileUpload} />
              </FormSection>
            </TabsContent>

            {/* PAN Form */}
            <TabsContent value="pan" className="mt-4 space-y-3">
              <FormSection title="PAN Card">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name" placeholder="Enter Full Name"
                    onChange={(e) => handleInputChange("name", e.target.value)} />
                  <Field label="Father’s Name" placeholder="Enter Father’s Name"
                    onChange={(e) => handleInputChange("father", e.target.value)} />
                  <Field label="Date of Birth" type="date"
                    onChange={(e) => handleInputChange("dob", e.target.value)} />
                  <Field label="PAN Number" placeholder="Enter PAN Number"
                    onChange={(e) => handleInputChange("panNumber", e.target.value)} />
                </div>
                <UploadBox label="PAN Card" file={uploadedFiles["pan"]} onUpload={handleFileUpload} />
              </FormSection>
            </TabsContent>

            {/* Similar structure continues for other tabs */}
          </Tabs>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t mt-4">
            <p className="text-[10px] text-gray-500">
              Upload any 1 of documents to submit
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                Save {activeTab === "aadhaar"
                  ? "Aadhaar"
                  : activeTab === "pan"
                  ? "PAN"
                  : activeTab === "voter"
                  ? "Voter ID"
                  : activeTab === "dl"
                  ? "DL"
                  : "Passport"}{" "}
                Card
              </Button>
              <Button size="sm" className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                Submit Task
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────── Helper Subcomponents ────────────── */

function FormSection({ title, children }) {
  return (
    <>
      <h3 className="font-semibold text-xs">{title}</h3>
      {children}
    </>
  );
}

function Field({ label, placeholder, type = "text", onChange }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input placeholder={placeholder} type={type} className="text-xs" onChange={onChange} />
    </div>
  );
}

function SelectField({ label, options, onChange }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <select className="border rounded-md p-2 text-xs w-full" onChange={onChange}>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function UploadBox({ label, file, onUpload }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer text-xs relative">
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={onUpload}
      />
      {file ? (
        <p className="text-green-600 font-medium">✅ {file.name}</p>
      ) : (
        <span className="text-blue-600 font-medium">⬆ Upload {label}</span>
      )}
    </div>
  );
}
