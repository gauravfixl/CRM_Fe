"use client";

import { Button } from "@/components/ui/button"; // Replace with your actual button import
import Image from "next/image";

export default function Components() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-700">
          Group and track work around components of your software architecture, cataloged in Compass.
          <a
            href="https://example.com/learn-more"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline ml-1"
          >
            Learn more about Compass components
          </a>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex items-center space-x-8">
        {/* Illustration */}
        <div className="flex space-x-2">
          <div className="bg-purple-100 p-4 rounded-lg">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
              <path d="M12 4v4m0 4v4m0 4v4m8-16h-4m-4 0H4m0 8h4m4 0h4m0 0h4" />
            </svg>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="bg-cyan-100 p-4 rounded-lg">
              <span className="text-cyan-600 font-bold text-2xl">+</span>
            </div>
            <div className="bg-cyan-100 p-4 rounded-lg">
              <span className="text-cyan-600 font-bold text-2xl">+</span>
            </div>
          </div>
        </div>

        {/* Text and CTA */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            You don't have any software components in Compass
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg">
            Work items can be linked to Compass software components, so you can track and manage the work on your software architecture.
          </p>

          <div className="mt-4 flex space-x-4">
            <Button asChild>
              <a
                href="https://example.com/create-component"
                target="_blank"
                rel="noopener noreferrer"
              >
                Create Compass component →
              </a>
            </Button>
            <a
              href="https://example.com/learn-more"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
