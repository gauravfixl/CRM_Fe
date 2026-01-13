"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import EditPrimaryDetailsWizard from "./editprimarydetailswizard";
import EditSecondaryDetailsWizard from "./editsecondarydetailswizard";

interface Field {
  id: number;
  label: string;
  value: string;
  isEditing?: boolean;
}

interface EmployeeData {
  name: string;
  fields: Field[];
  primaryDetails: Record<string, string>;
  contactDetails: Record<string, string>;
}

export default function CustomProfile() {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openPrimaryWizard, setOpenPrimaryWizard] = useState(false);
 const [openSecondaryWizard, setOpenSecondaryWizard] = useState(false);
 const [customCards, setCustomCards] = useState<
  {
    id: number;
    title: string;
    fields: { label: string; type: string; required: boolean; readonly?: boolean }[];
    editing?: boolean; // new
  }[]
>([]);


  useEffect(() => {
    setTimeout(() => {
      setEmployee({
        name: "Employee Name",
        fields: [
          { id: 1, label: "Job Title", value: "" },
          { id: 2, label: "Work Email", value: "" },
          { id: 3, label: "Mobile Number", value: "" },
          { id: 4, label: "Work Location", value: "" },
        ],
        primaryDetails: {
          "First Name": "XXXXXXXXX",
          "Middle Name": "XXXXXXXXX",
          "Last Name": "XXXXXXXXX",
          "Display Name": "XXXXXXXXX",
          Gender: "XXXXXXXXX",
          "Date of Birth": "XXXXXXXXX",
          "Marital Status": "XXXXXXXXX",
          "Blood Group": "XXXXXXXXX",
          "Marriage Date": "XXXXXXXXX",
          "Physically Handicapped": "XXXXXXXXX",
        },
        contactDetails: {
          "Work Email": "XXXXXXXXX",
          "Personal Email": "XXXXXXXXX",
          "Mobile Number": "XXXXXXXXX",
          "Work Number": "XXXXXXXXX",
          "Residence Number": "XXXXXXXXX",
          Skype: "XXXXXXXXX",
          "Remote Employee": "XXXXXXXXX",
        },
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleAddField = () => {
    if (!employee) return;
    const newField: Field = {
      id: Date.now(),
      label: "",
      value: "",
      isEditing: true,
    };
    setEmployee({
      ...employee,
      fields: [...employee.fields, newField],
    });
  };

  const handleRemoveField = (id: number) => {
    if (!employee) return;
    const updatedFields = employee.fields.filter((f) => f.id !== id);
    setEmployee({ ...employee, fields: updatedFields });
  };

  const handleFieldChange = (id: number, newLabel: string) => {
    if (!employee) return;
    const updatedFields = employee.fields.map((f) =>
      f.id === id ? { ...f, label: newLabel } : f
    );
    setEmployee({ ...employee, fields: updatedFields });
  };

  const handleFieldBlur = (id: number) => {
    if (!employee) return;
    const updatedFields = employee.fields.map((f) =>
      f.id === id ? { ...f, isEditing: false } : f
    );
    setEmployee({ ...employee, fields: updatedFields });
  };

  const handleEditField = (id: number) => {
    if (!employee) return;
    const updatedFields = employee.fields.map((f) =>
      f.id === id ? { ...f, isEditing: true } : f
    );
    setEmployee({ ...employee, fields: updatedFields });
  };
  const handleAddCustomCard = () => {
  const newCard = {
    id: Date.now(),
    title: "New Card",
    fields: [{ label: "Field 1", type: "Text", required: false }],
     editing: true, // new
  };
  setCustomCards([...customCards, newCard]);
};


  const handleUpdateCustomCard = (id: number, updatedFields: Record<string, string>) => {
    setCustomCards(
      customCards.map((c) => (c.id === id ? { ...c, fields: updatedFields } : c))
    );
  };

  if (loading || !employee) {
    return (
      <div className="text-center text-xs text-gray-500 p-8">
        Loading profile...
      </div>
    );
  }

  return (
    <>
    <div className="p-4 text-xs space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="font-semibold text-gray-800 text-sm">
          Customise Profile – 🇮🇳 India
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-6 px-3 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs h-6 px-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Publish Changes
          </Button>
          <Button
          size="sm"
          className="text-xs h-6 px-3 bg-green-600 hover:bg-green-700 text-white"
          onClick={handleAddCustomCard}
        >
          + Add New Card
        </Button>
        </div>
      </div>

      {/* Alert Bar */}
      <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[11px] px-3 py-2 rounded">
        ⚠️ Any changes done here will be reflected for everyone in the organisation who have work location: 🇮🇳 India
      </div>

      {/* Employee Card */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold rounded-md">
            X
          </div>

          {/* Employee Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-sm">
              {employee.name}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {employee.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between text-gray-700 text-[12px] gap-1 border px-2 py-1 rounded hover:bg-gray-50"
                >
                  {field.isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      onBlur={() => handleFieldBlur(field.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFieldBlur(field.id);
                      }}
                      className="w-full bg-transparent outline-none text-gray-700 text-[12px]"
                      placeholder="Enter field name"
                    />
                  ) : (
                    <span
                      onClick={() => handleEditField(field.id)}
                      className="text-gray-600 font-medium cursor-text"
                    >
                      {field.label || "Untitled Field"}
                    </span>
                  )}

                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Remove field"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Add field button */}
              <button
                onClick={handleAddField}
                className="flex items-center text-blue-600 text-[12px] mt-1 hover:underline"
              >
                <Plus size={12} className="mr-1" /> Add field
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="border-b pb-1 text-[12px] font-medium text-gray-700">
        PROFILE
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Primary Details */}
        <Card className="border border-gray-200 shadow-sm rounded-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">
                Primary Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 text-xs font-medium h-5 px-2"
                 onClick={() => setOpenPrimaryWizard(true)}
              >
                ✎ Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              {Object.entries(employee.primaryDetails).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                    {key}
                  </span>
                  <span className="text-[13px] font-medium text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="border border-gray-200 shadow-sm rounded-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">
                Contact Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 text-xs font-medium h-5 px-2"
                 onClick={() => setOpenSecondaryWizard(true)}
              >
                ✎ Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              {Object.entries(employee.contactDetails).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                    {key}
                  </span>
                  <span className="text-[13px] font-medium text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  {customCards.map((card) => (
  <Card key={card.id} className="border border-gray-200 shadow-sm rounded-md mt-3">
    <CardContent className="p-4">

      {card.editing ? (
        <>
          {/* Card Header */}
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <input
              type="text"
              value={card.title}
              onChange={(e) =>
                setCustomCards(
                  customCards.map((c) =>
                    c.id === card.id ? { ...c, title: e.target.value } : c
                  )
                )
              }
              className="border px-2 py-1 rounded text-[12px] flex-1"
            />
          </div>

          {/* Fields */}
          <div className="space-y-2">
            {card.fields.map((field, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => {
                    const updatedFields = card.fields.map((f, i) =>
                      i === idx ? { ...f, label: e.target.value } : f
                    );
                    setCustomCards(
                      customCards.map((c) =>
                        c.id === card.id ? { ...c, fields: updatedFields } : c
                      )
                    );
                  }}
                  placeholder="Field Name"
                  className="border px-2 py-1 rounded text-[12px] flex-1"
                />

                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedFields = card.fields.map((f, i) =>
                      i === idx ? { ...f, type: e.target.value } : f
                    );
                    setCustomCards(
                      customCards.map((c) =>
                        c.id === card.id ? { ...c, fields: updatedFields } : c
                      )
                    );
                  }}
                  className="border px-1 py-1 text-[11px]"
                >
                  <option>Text</option>
                  <option>Date</option>
                  <option>Dropdown</option>
                </select>

                <label className="flex items-center text-[11px] gap-1">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const updatedFields = card.fields.map((f, i) =>
                        i === idx ? { ...f, required: e.target.checked } : f
                      );
                      setCustomCards(
                        customCards.map((c) =>
                          c.id === card.id ? { ...c, fields: updatedFields } : c
                        )
                      );
                    }}
                  />
                  Req
                </label>

                <button
                  onClick={() => {
                    const updatedFields = card.fields.filter((_, i) => i !== idx);
                    setCustomCards(
                      customCards.map((c) =>
                        c.id === card.id ? { ...c, fields: updatedFields } : c
                      )
                    );
                  }}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button
            size="sm"
            className="mt-2 text-xs h-6 px-3 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              setCustomCards(
                customCards.map((c) =>
                  c.id === card.id
                    ? {
                        ...c,
                        editing: false,
                        fields: c.fields.map((f) => ({ ...f, readonly: true })),
                      }
                    : c
                )
              );
            }}
          >
            Save
          </Button>
        </>
      ) : (
        // Readonly view like Primary/Contact Details
        <>
          <h3 className="font-semibold text-gray-700 text-sm mb-2">{card.title}</h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6">
            {card.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                  {field.label}
                </span>
                <span className="text-[13px] font-medium text-gray-800">
                  {field.type} {field.required ? "(Req)" : ""}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </CardContent>
  </Card>
))}




    </div>
    
     <EditPrimaryDetailsWizard
  isOpen={openPrimaryWizard}
  onClose={() => setOpenPrimaryWizard(false)}
  fields={employee.primaryDetails}
  onSave={(updatedFields) =>
    setEmployee({ ...employee, primaryDetails: updatedFields })
  }
/>
 <EditSecondaryDetailsWizard
        isOpen={openSecondaryWizard}
        onClose={() => setOpenSecondaryWizard(false)}
        fields={employee.contactDetails}
        onSave={(updatedFields) =>
          setEmployee({ ...employee, contactDetails: updatedFields })
        }
      />
</>
  );
}
