"use client";

import Image from "next/image";

export default function MicrosoftTeamsIntegration() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white text-center">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-8">
        {/* Microsoft Teams icon */}
        <Image
          src="/icons/teams-logo.svg" // Replace with actual Teams logo path
          alt="Microsoft Teams"
          width={32}
          height={32}
        />
        <h1 className="text-2xl font-bold text-gray-900">Microsoft Teams Integration</h1>
      </div>

      {/* Main illustration */}
      <div className="mb-8">
        <Image
          src="/images/teams-illustration.png" // Replace with your actual image
          alt="Cubicle Cloud for Microsoft Teams"
          width={400}
          height={250}
        />
      </div>

      {/* Title + Text */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Cubicle Cloud for Microsoft Teams
      </h2>
      <p className="text-gray-600 max-w-xl">
        With the power of two tools in one view, get real-time updates, better alignment, and a shorter delivery time with instant clarity and context.
      </p>

      {/* Sign-in button */}
      <div className="mt-6">
        <a
          href="#"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          <Image
            src="/icons/microsoft-logo.svg" // Replace with actual Microsoft logo
            alt="Microsoft"
            width={20}
            height={20}
          />
          <span>Sign in with Microsoft</span>
        </a>
      </div>
    </div>
  );
}
