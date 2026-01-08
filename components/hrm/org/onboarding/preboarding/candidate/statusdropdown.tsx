// StatusDropdown.tsx
import { CustomSelect, CustomSelectTrigger, CustomSelectValue, CustomSelectContent, CustomSelectItem } from "@/components/custom/CustomSelect";

export default function StatusDropdown({ value, onChange }) {
  return (
    <CustomSelect value={value} onValueChange={onChange} >
      <CustomSelectTrigger >
        <CustomSelectValue placeholder="CustomSelect Status" />
      </CustomSelectTrigger>
      <CustomSelectContent>
        <CustomSelectItem value="Not Started">Not Started</CustomSelectItem>
        <CustomSelectItem value="Pending">Pending</CustomSelectItem>
        <CustomSelectItem value="Completed">Completed</CustomSelectItem>
      </CustomSelectContent>
    </CustomSelect>
  );
}
