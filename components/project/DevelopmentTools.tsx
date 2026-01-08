"use client";

import { useState } from "react";

export default function DevelopmentToolsEmptyState() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        {/* Replace with your actual icon if needed */}
        <div className="w-6 h-6">
          <svg className="w-full h-full text-gray-700" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 2L2 9M2 15L9 22M15 2L22 9M22 15L15 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Development tools</h1>
      </div>

      {/* Card */}
      <div className="border rounded-md p-8 text-center max-w-3xl bg-white">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-gray-200"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 12h.01M20.59 5.41l-2.83-2.83a2 2 0 00-2.83 0L12 5.41 8.41 2a2 2 0 00-2.83 0L2.76 5.41a2 2 0 000 2.83L5.41 12l-2.65 2.65a2 2 0 000 2.83l2.83 2.83a2 2 0 002.83 0L12 18.59l3.59 3.59a2 2 0 002.83 0l2.83-2.83a2 2 0 000-2.83L18.59 12l2.65-2.65a2 2 0 000-2.83z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Title + Text */}
        <h2 className="text-xl font-semibold text-gray-900">
          Connect your development tools to Subivl
        </h2>
        <p className="text-gray-600 mt-2">
          Unleash a completely integrated development experience by connecting your development tools to Cubicle.{" "}
          <a href="#" className="text-blue-600 hover:underline">Learn more.</a>
        </p>

        {/* Dropdown Button */}
        <div className="mt-6">
          <div className="inline-block relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 focus:outline-none"
            >
              Connect ▾
            </button>

            {open && (
              <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">GitHub</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bitbucket</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">GitLab</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
