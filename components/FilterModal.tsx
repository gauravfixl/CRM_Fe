"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FilterModalProps {
  filterData: {
    assignee?: { id: string; text: string }[];
    labels?: { id: string; text: string }[];
    priority?: { id: string; text: string }[];
  };
  onApply: (filters: any) => void;
  onClose: () => void;
}

const filterCategories = [
  "Parent",
  "Sprint",
  "Assignee",
  "Work type",
  "Labels",
  "Status",
  "Priority",
];

const statusOptions = [
  { label: "To Do", value: "todo" },
  { label: "Done", value: "done" },
  { label: "In Progress", value: "in-progress" },
  { label: "Review", value: "review" },
];

export default function FilterModal({
  filterData,
  onApply,
  onClose,
}: FilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("Status");
  const [searchText, setSearchText] = useState("");

  const filteredStatusOptions = statusOptions.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex h-[400px]">
          {/* Sidebar */}
          <div className="w-1/4 border-r bg-muted p-4 space-y-2">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === category
                    ? "bg-white text-primary font-medium"
                    : "hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Main Filter Content */}
          <div className="w-3/4 p-4 overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold">{selectedCategory}</h2>

            <Input
              placeholder={`Search ${selectedCategory.toLowerCase()}`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {selectedCategory === "Status" && (
              <div className="space-y-2">
                {filteredStatusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => {
                      onApply({ status: option.value });
                      onClose();
                    }}
                  >
                    <input type="checkbox" readOnly />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory === "Assignee" && filterData.assignee && (
              <div className="space-y-2">
                {filterData.assignee
                  .filter((assignee) =>
                    assignee.text.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => {
                        onApply({ assignee: assignee.id });
                        onClose();
                      }}
                    >
                      <input type="checkbox" readOnly />
                      <span>{assignee.text}</span>
                    </div>
                  ))}
              </div>
            )}

            {selectedCategory === "Labels" && filterData.labels && (
              <div className="space-y-2">
                {filterData.labels
                  .filter((label) =>
                    label.text.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => {
                        onApply({ label: label.id });
                        onClose();
                      }}
                    >
                      <input type="checkbox" readOnly />
                      <span>{label.text}</span>
                    </div>
                  ))}
              </div>
            )}

            {selectedCategory === "Priority" && filterData.priority && (
              <div className="space-y-2">
                {filterData.priority
                  .filter((priority) =>
                    priority.text.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((priority) => (
                    <div
                      key={priority.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => {
                        onApply({ priority: priority.id });
                        onClose();
                      }}
                    >
                      <input type="checkbox" readOnly />
                      <span>{priority.text}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
