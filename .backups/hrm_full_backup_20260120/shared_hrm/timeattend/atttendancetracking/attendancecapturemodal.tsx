"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Fingerprint, MapPin, Smartphone } from "lucide-react";

export default function AttendanceCaptureModal() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      icon: <Fingerprint className="w-12 h-12 text-blue-500" />,
      title: "Do you capture attendance via bio-metric devices?",
      description:
        "Attendance will be captured through bio-metric devices set at your location.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-green-500" />,
      title: "Do your employees work remotely?",
      description:
        "Remote work is when an employee works from places like home, location, etc. instead of office.",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-pink-500" />,
      title: "Do you also want to capture attendance via Cubicle mobile app?",
      description:
        "Useful when you have field employees whose location needs to be captured.",
    },
  ];

  const current = steps[step - 1];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[360px] rounded-2xl shadow-lg">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full ${
                  idx < step ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>

          {/* Icon */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            {current.icon}
          </motion.div>

          {/* Title */}
          <h2 className="text-sm font-medium mb-2">{current.title}</h2>

          {/* Description */}
          <p className="text-gray-500 text-xs mb-6">{current.description}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5"
              onClick={nextStep}
            >
              Yes
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs px-5"
              onClick={nextStep}
            >
              No
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
