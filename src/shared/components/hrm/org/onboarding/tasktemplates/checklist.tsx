// components/hrm/onboarding/tasktemplates/Checklist.tsx
import { useState } from "react";

interface ChecklistItem {
  text: string;
  finalized?: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
}

export default function Checklist({ items }: ChecklistProps) {
  // Track checked state separately if needed
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    items.map((item) => item.finalized || false)
  );

  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  return (
    <div className="p-3 border rounded-md space-y-2 bg-gray-50">
      <h4 className="text-sm font-semibold">Checklist</h4>
      {items.length === 0 && (
        <p className="text-xs text-gray-400">No items yet</p>
      )}
      {items.map((item, index) => (
        <label
          key={index}
          className="flex items-center gap-2 text-xs cursor-pointer"
        >
          <input
            type="checkbox"
            checked={checkedItems[index]}
            onChange={() => toggleItem(index)}
          />
          <span
            className={`${
              checkedItems[index] ? "line-through text-gray-400" : ""
            }`}
          >
            {item.text}
          </span>
        </label>
      ))}
    </div>
  );
}
