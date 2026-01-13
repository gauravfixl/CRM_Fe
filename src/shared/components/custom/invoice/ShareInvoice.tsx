"use client";

import { RWebShare } from "react-web-share";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip"; // if you already have shadcn Tooltip
import { BsFillShareFill } from "react-icons/bs";

export default function ShareInvoice() {
  const path = typeof window !== "undefined" ? window.location.href : "";
  const pathname = usePathname();

  return (
    <RWebShare
      data={{
        text: "Check this invoice",
        url: path || pathname,
        title: "Invoice",
      }}
    >
      <div className="flex items-center justify-between bg-blue-600 rounded-md px-4 py-2 text-white cursor-pointer hover:bg-blue-700 transition">
        <span className="text-sm font-medium">Share Invoice</span>
        <Tooltip>
          <BsFillShareFill className="ml-2 text-white text-sm cursor-pointer" />
        </Tooltip>
      </div>
    </RWebShare>
  );
}
