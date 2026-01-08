"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  selected: string[]
  setSelected: (value: string[]) => void
  options: Option[]
  placeholder?: string
}

export function MultiSelect({
  selected,
  setSelected,
  options,
  placeholder = "Select...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length > 0
            ? selected.map((val) => options.find((o) => o.value === val)?.label).join(", ")
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 space-y-1">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggleOption(option.value)}
            />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
