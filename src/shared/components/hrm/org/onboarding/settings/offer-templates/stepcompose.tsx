"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// dynamically import Quill for Next.js SSR safety
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type StepComposeProps = {
  payload: any;
  setPayload: (payload: any) => void;
};

export default function StepCompose({ payload, setPayload }: StepComposeProps) {
  const [mode, setMode] = useState<"web" | "ms">("web");

  return (
    <div className="p-6 text-xs">
      {/* Mode Toggle Buttons */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setMode("web")}
          className={`text-xs px-2 py-1 rounded ${
            mode === "web" ? "bg-blue-50 text-blue-700" : ""
          }`}
        >
          Web Editor
        </button>
        <button
          onClick={() => setMode("ms")}
          className={`text-xs px-2 py-1 rounded ${
            mode === "ms" ? "bg-blue-50 text-blue-700" : ""
          }`}
        >
          MS Word
        </button>
      </div>

      {/* Web Editor Mode */}
      {mode === "web" && (
        <div>
          <ReactQuill
            value={payload.contentHtml || ""}
            onChange={(val) => setPayload({ ...payload, contentHtml: val })}
            className="text-xs"
          />
        </div>
      )}

      {/* MS Word Upload Mode */}
      {mode === "ms" && (
        <div className="border rounded p-3 text-xs">
          <p className="text-xs text-gray-600 mb-2">
            Upload MS Word template (.docx)
          </p>
          <input
            type="file"
            accept=".doc,.docx"
            onChange={(e) =>
              setPayload({ ...payload, msDoc: e.target.files?.[0] || null })
            }
            className="mb-3"
          />

          <div className="mt-3 text-xs text-gray-600">
            Placeholder reference (mock)
          </div>

          <table className="w-full text-xs mt-2 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Field</th>
                <th className="p-2 text-left">Placeholder</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">First Name</td>
                <td className="p-2">{`{{BasicInfo.FirstName}}`}</td>
              </tr>
              <tr>
                <td className="p-2">Last Name</td>
                <td className="p-2">{`{{BasicInfo.LastName}}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
