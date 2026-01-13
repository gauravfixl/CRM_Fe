"use client";

import { useState } from "react";
import { enableSupportAccess as enableSupportAccessApi } from "@/hooks/supportHooks";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";

export default function SupportAgentPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnableSupportAccess = async () => {
    setLoading(true);
    try {
      const res = await enableSupportAccessApi();
      setToken(res.data.passkey);
    } catch (err) {
      console.error(err);
      alert("Failed to enable support access");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-[80vh] text-gray-900 px-4 py-8 gap-8">
      <div className="w-full md:w-1/2 flex justify-center">
        <video src="/videos/support.mp4" autoPlay loop muted className="w-full max-w-lg rounded-lg shadow-md">
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
        <h6 className="text-primary text-4xl font-bold">Support Agent</h6>
        <p className="text-gray-700">
          Empowering support agents to assist users efficiently, <br />
          resolve queries instantly, and deliver seamless experiences.
        </p>
        <CustomButton onClick={handleEnableSupportAccess} disabled={loading} className="bg-primary/80 hover:bg-primary/90 text-white py-2 px-6 rounded-lg">
          {loading ? "Enabling..." : "Enable Support Access"}
        </CustomButton>
        <div className="border rounded-lg p-4 w-full max-w-md flex items-center justify-between shadow-sm">
          <CustomInput type="text" readOnly value={token} placeholder="Your support token will appear here" className="w-full font-mono text-gray-800 bg-transparent outline-none" />
          <CustomButton onClick={copyToClipboard} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            {copied ? "Copied!" : "Copy"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
