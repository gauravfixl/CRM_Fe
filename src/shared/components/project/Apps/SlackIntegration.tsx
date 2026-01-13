"use client";

import Image from "next/image";

export default function SlackIntegration() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-12 text-center">
      {/* Header */}
      <div className="flex items-center space-x-2 absolute top-8 left-8">
        <Image
          src="/icons/slack-logo.svg" // Place this in /public/icons/
          alt="Slack Logo"
          width={24}
          height={24}
        />
        <h1 className="text-xl font-semibold text-gray-900">Slack integration</h1>
      </div>

      {/* Main Illustration */}
      <div className="mb-8">
        <Image
          src="/images/slack-illustration.png" // Place this in /public/images/
          alt="Slack Integration Illustration"
          width={300}
          height={200}
        />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Stay up-to-date in Slack</h2>

      {/* Description */}
      <p className="text-gray-600 max-w-lg mb-6">
        Track project progress by connecting your project to your team’s channel in Slack.
      </p>

      {/* CTA */}
      <a
        href="#"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition"
      >
        Connect to Slack
      </a>
    </div>
  );
}
