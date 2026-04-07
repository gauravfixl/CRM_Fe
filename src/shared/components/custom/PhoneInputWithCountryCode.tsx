"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Search } from "lucide-react"
import { COUNTRY_PHONE_DATA, type CountryPhoneInfo } from "@/data/countryPhoneData"

interface PhoneInputWithCountryCodeProps {
  value: string
  onChange: (fullValue: string) => void
  error?: string
  className?: string
  required?: boolean
}

export const PhoneInputWithCountryCode: React.FC<PhoneInputWithCountryCodeProps> = ({
  value,
  onChange,
  error,
  className,
  required,
}) => {
  // Default to India
  const defaultCountry = COUNTRY_PHONE_DATA.find(c => c.code === "IN") || COUNTRY_PHONE_DATA[0]
  const [selectedCountry, setSelectedCountry] = useState<CountryPhoneInfo>(defaultCountry)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Parse initial value on mount
  useEffect(() => {
    if (value) {
      const match = COUNTRY_PHONE_DATA.find(c => value.startsWith(c.dialCode))
      if (match) {
        setSelectedCountry(match)
        setPhoneNumber(value.slice(match.dialCode.length))
      } else {
        setPhoneNumber(value)
      }
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRY_PHONE_DATA
    const q = searchQuery.toLowerCase()
    return COUNTRY_PHONE_DATA.filter(
      c => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleCountrySelect = (country: CountryPhoneInfo) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery("")
    onChange(`${country.dialCode}${phoneNumber}`)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    const limited = raw.slice(0, selectedCountry.digits)
    setPhoneNumber(limited)
    onChange(`${selectedCountry.dialCode}${limited}`)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "flex items-center border rounded-lg bg-white transition-all",
        error ? "border-red-400 focus-within:ring-2 focus-within:ring-red-500/20" : "border-zinc-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
      )}>
        {/* Country Code Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-2 text-sm border-r border-zinc-200 hover:bg-zinc-50 rounded-l-lg transition-colors whitespace-nowrap"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="font-medium text-zinc-700">{selectedCountry.dialCode}</span>
            <ChevronDown size={14} className={cn("text-zinc-400 transition-transform", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-zinc-100">
                <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 rounded-md">
                  <Search size={14} className="text-zinc-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>
              {/* List */}
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-zinc-400">No countries found</div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 transition-colors text-left",
                        selectedCountry.code === country.code && "bg-blue-50 text-blue-700"
                      )}
                    >
                      <span className="text-base">{country.flag}</span>
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="text-zinc-500 font-medium">{country.dialCode}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={`Enter ${selectedCountry.digits} digit number`}
          className="flex-1 px-3 py-2 text-sm outline-none bg-transparent rounded-r-lg placeholder:text-zinc-400"
        />
      </div>

      {/* Hint text */}
      <p className="text-[11px] text-zinc-400 mt-1">
        {selectedCountry.flag} {selectedCountry.name} — Enter {selectedCountry.digits} digits (e.g. {selectedCountry.dialCode} {"X".repeat(selectedCountry.digits)})
      </p>

      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  )
}
