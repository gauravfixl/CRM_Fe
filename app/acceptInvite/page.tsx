'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAcceptInvite } from "@/hooks/userHooks";
import { showError, showSuccess } from "@/utils/toast";

const AcceptInvitation = () => {
  const [showDecline, setShowDecline] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const router = useRouter();

  const { acceptInvite, loading } = useAcceptInvite();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (!token) console.error("No token found in URL");
  }, []);

  const acceptInvitation = async () => {
    setBtnDisabled(true);
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      showError("Invalid or missing invitation token.");
      setBtnDisabled(false);
      return;
    }

    try {
      await acceptInvite(token);
      showSuccess("Invitation accepted");
      router.push("/");
    } catch (err) {
      console.error(err);
      showError("Unable to accept invitation");
    } finally {
      setBtnDisabled(false);
    }
  };

  return (
    <div className="accept-invitation-container min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="accept-invitation-card relative bg-white rounded-2xl shadow-xl max-w-4xl w-full flex overflow-hidden">
        {/* Left Section: Image/Illustration */}
        <div className="accept-invitation-left hidden md:flex w-1/2 bg-gradient-to-b from-primary/80 to-primary/40 items-center justify-center p-6">
          <Image
            src="/images/cubicleweb.png"
            alt="Cubicle Logo"
            width={400}
            height={400}
            className="accept-invitation-logo"
          />
        </div>

        {/* Right Section: Form & Buttons */}
        <div className="accept-invitation-right w-full md:w-1/2 p-8 relative">
          {/* Cross button to decline */}
          <button
            className="accept-invitation-close absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            onClick={() => setShowDecline(true)}
          >
            ✕
          </button>

          <h2 className="accept-invitation-title text-3xl font-bold text-gray-800 mb-2">
            You're Invited!
          </h2>
          <p className="accept-invitation-subtitle text-gray-600 mb-6">
            You have been invited to join{" "}
            <span className="accept-invitation-org font-semibold text-primary">
              Cubicle
            </span>
          </p>

          <div className="accept-invitation-details mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-left">
            <p className="accept-invitation-email text-gray-700">
              Invitation for:{" "}
              <span className="font-medium text-primary">
                tusharmdni@gmail.com
              </span>
            </p>
            <p className="accept-invitation-expiry text-gray-500 text-sm mt-1">
              Expires: Sep 02
            </p>
          </div>

          <Button
            className="accept-invitation-accept-btn w-full bg-primary text-white hover:bg-primary/90 mb-4"
            disabled={btnDisabled || loading}
            onClick={acceptInvitation}
          >
            {btnDisabled || loading ? "Processing..." : "Accept Invitation"}
          </Button>

          <Button
            variant="outline"
            className="accept-invitation-decline-btn w-full text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={() => setShowDecline(true)}
          >
            Decline Invitation
          </Button>
        </div>
      </div>

      {/* Optional Decline Modal */}
      {showDecline && (
        <div className="decline-modal fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="decline-modal-content bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="decline-modal-title text-lg font-semibold mb-4">
              Decline Invitation
            </h3>
            <p className="decline-modal-message text-gray-600 mb-6">
              Are you sure you want to decline?
            </p>
            <div className="decline-modal-actions flex justify-center gap-3">
              <Button
                className="decline-modal-yes bg-red-600 text-white hover:bg-red-700"
                onClick={() => router.push("/auth/signin")}
              >
                Yes
              </Button>
              <Button
                className="decline-modal-no bg-gray-400 hover:bg-gray-600"
                onClick={() => setShowDecline(false)}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptInvitation;
