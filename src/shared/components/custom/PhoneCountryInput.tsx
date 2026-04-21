"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";

export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
  lengths: number[];
};

// Compact curated list. `lengths` = acceptable national number digit counts.
export const COUNTRIES: PhoneCountry[] = [
  { iso: "IN", name: "India", dial: "+91", flag: "🇮🇳", lengths: [10] },
  { iso: "US", name: "United States", dial: "+1", flag: "🇺🇸", lengths: [10] },
  { iso: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", lengths: [10] },
  { iso: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", lengths: [10] },
  { iso: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", lengths: [9] },
  { iso: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", lengths: [8] },
  { iso: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", lengths: [9] },
  { iso: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿", lengths: [8, 9] },
  { iso: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", lengths: [10, 11] },
  { iso: "FR", name: "France", dial: "+33", flag: "🇫🇷", lengths: [9] },
  { iso: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", lengths: [9, 10] },
  { iso: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", lengths: [9] },
  { iso: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", lengths: [9] },
  { iso: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", lengths: [9] },
  { iso: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪", lengths: [9] },
  { iso: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭", lengths: [9] },
  { iso: "AT", name: "Austria", dial: "+43", flag: "🇦🇹", lengths: [10, 11] },
  { iso: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪", lengths: [9] },
  { iso: "NO", name: "Norway", dial: "+47", flag: "🇳🇴", lengths: [8] },
  { iso: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰", lengths: [8] },
  { iso: "FI", name: "Finland", dial: "+358", flag: "🇫🇮", lengths: [9, 10] },
  { iso: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪", lengths: [9] },
  { iso: "PL", name: "Poland", dial: "+48", flag: "🇵🇱", lengths: [9] },
  { iso: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿", lengths: [9] },
  { iso: "GR", name: "Greece", dial: "+30", flag: "🇬🇷", lengths: [10] },
  { iso: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷", lengths: [10] },
  { iso: "RU", name: "Russia", dial: "+7", flag: "🇷🇺", lengths: [10] },
  { iso: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦", lengths: [9] },
  { iso: "CN", name: "China", dial: "+86", flag: "🇨🇳", lengths: [11] },
  { iso: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰", lengths: [8] },
  { iso: "TW", name: "Taiwan", dial: "+886", flag: "🇹🇼", lengths: [9] },
  { iso: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", lengths: [10] },
  { iso: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷", lengths: [9, 10] },
  { iso: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭", lengths: [9] },
  { iso: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳", lengths: [9, 10] },
  { iso: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾", lengths: [9, 10] },
  { iso: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩", lengths: [9, 10, 11] },
  { iso: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭", lengths: [10] },
  { iso: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰", lengths: [10] },
  { iso: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩", lengths: [10] },
  { iso: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰", lengths: [9] },
  { iso: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵", lengths: [10] },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", lengths: [9] },
  { iso: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦", lengths: [8] },
  { iso: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼", lengths: [8] },
  { iso: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭", lengths: [8] },
  { iso: "OM", name: "Oman", dial: "+968", flag: "🇴🇲", lengths: [8] },
  { iso: "IL", name: "Israel", dial: "+972", flag: "🇮🇱", lengths: [9] },
  { iso: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬", lengths: [10] },
  { iso: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", lengths: [9] },
  { iso: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", lengths: [10] },
  { iso: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪", lengths: [9] },
  { iso: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭", lengths: [9] },
  { iso: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦", lengths: [9] },
  { iso: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", lengths: [10, 11] },
  { iso: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", lengths: [10] },
  { iso: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷", lengths: [10] },
  { iso: "CL", name: "Chile", dial: "+56", flag: "🇨🇱", lengths: [9] },
  { iso: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴", lengths: [10] },
  { iso: "PE", name: "Peru", dial: "+51", flag: "🇵🇪", lengths: [9] },
];

export const DEFAULT_COUNTRY_ISO = "IN";

export const findCountry = (iso: string) =>
  COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];

export const validatePhoneForCountry = (
  iso: string,
  national: string
): string | null => {
  const c = findCountry(iso);
  const digits = national.replace(/\D/g, "");
  if (!digits) return "Phone number is required";
  if (!c.lengths.includes(digits.length)) {
    const expect = c.lengths.join(" or ");
    return `For ${c.name} (${c.dial}), phone must be ${expect} digits`;
  }
  return null;
};

export const expectedLengthHint = (iso: string) => {
  const c = findCountry(iso);
  return `${c.dial} ${c.name}: expects ${c.lengths.join(" or ")} digit${
    c.lengths[0] === 1 ? "" : "s"
  }`;
};

type Props = {
  value: string; // national digits
  countryIso: string;
  onChange: (national: string, countryIso: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
};

export const PhoneCountryInput: React.FC<Props> = ({
  value,
  countryIso,
  onChange,
  placeholder = "9876543210",
  hasError,
  disabled,
}) => {
  const country = findCountry(countryIso);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (ev: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(q.replace("+", ""))
    );
  }, [query]);

  const maxLen = Math.max(...country.lengths);

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={cn(
          "flex items-stretch rounded-lg border bg-white dark:bg-zinc-950 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
          hasError
            ? "border-red-400"
            : "border-zinc-200 dark:border-zinc-800"
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm focus:outline-none"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            {country.dial}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          maxLength={maxLen}
          onChange={(ev) => {
            const digits = ev.target.value.replace(/\D/g, "").slice(0, maxLen);
            onChange(digits, countryIso);
          }}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <input
              autoFocus
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              placeholder="Search country or code..."
              className="flex-1 bg-transparent text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-zinc-400 text-center">
                No match
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.iso}
                  type="button"
                  onClick={() => {
                    const newMax = Math.max(...c.lengths);
                    const trimmed = value
                      .replace(/\D/g, "")
                      .slice(0, newMax);
                    onChange(trimmed, c.iso);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    c.iso === countryIso &&
                      "bg-primary/5 dark:bg-primary/10"
                  )}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 text-zinc-700 dark:text-zinc-200 truncate">
                    {c.name}
                  </span>
                  <span className="text-zinc-500 font-medium">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
