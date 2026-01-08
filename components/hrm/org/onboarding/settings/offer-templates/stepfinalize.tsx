"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { renderAsync } from "docx-preview";

export default function StepFinalize({ payload }) {
  const [openViewer, setOpenViewer] = useState(false);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("📄 Modal open state changed:", openViewer);
    console.log("📦 MS DOC Detected:", payload.msDoc);

    if (openViewer && payload.msDoc && viewerRef.current) {
      const file = payload.msDoc;
      console.log("🚀 Preparing to render:", file.name, "size:", file.size);

      if (file.size > 15 * 1024 * 1024) {
        console.warn("⚠️ File too large for docx-preview; switching to Office Viewer");
        setUseOfficeViewer(true);
        return;
      }

      setUseOfficeViewer(false);
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          viewerRef.current!.innerHTML = "<p class='text-gray-400 text-xs'>Rendering document...</p>";
          try {
            await renderAsync(e.target.result, viewerRef.current!, undefined, {
              className: "docx-viewer text-xs text-gray-700",
              inWrapper: true,
            });
            console.log("🎉 DOCX successfully rendered");
          } catch (err) {
            console.error("❌ Rendering error:", err);
            viewerRef.current!.innerHTML =
              "<p class='text-red-500 text-xs p-4'>❌ Failed to render this DOCX file.</p>";
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }, [openViewer, payload.msDoc]);

  const officeUrl =
    payload.msDoc && typeof window !== "undefined"
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          URL.createObjectURL(payload.msDoc)
        )}`
      : null;

  return (
    <div className="p-6 text-xs space-y-4">
      <h2 className="text-sm font-semibold mb-2">Review Offer Template</h2>

      <div className="space-y-1">
        <p>
          <strong className="text-gray-700">Template Name:</strong> {payload.name || "-"}
        </p>
        <p>
          <strong className="text-gray-700">Description:</strong> {payload.description || "-"}
        </p>
      </div>

      {payload.msDoc && (
        <div className="border rounded-md p-3 bg-gray-50">
          <p className="font-semibold text-gray-700 mb-2">Uploaded MS Word Template</p>
          <div className="flex items-center justify-between text-xs text-gray-700">
            <div>
              📄 <strong>{payload.msDoc.name}</strong>
              <p className="text-gray-500">
                {(payload.msDoc.size / 1024 / 1024).toFixed(2)} MB • {payload.msDoc.type}
              </p>
            </div>
            <button onClick={() => setOpenViewer(true)} className="px-2 py-1 text-blue-600 hover:underline">
              View
            </button>
          </div>
        </div>
      )}

      <Dialog open={openViewer} onOpenChange={setOpenViewer}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 overflow-hidden">
          <DialogTitle className="px-4 py-2 text-sm font-semibold border-b flex justify-between items-center">
            {payload.msDoc?.name || "Offer Letter Preview"}
            <button onClick={() => setOpenViewer(false)} className="text-gray-500 hover:text-gray-700 text-xs">
              ✕
            </button>
          </DialogTitle>
          <DialogDescription className="sr-only">Preview of uploaded MS Word file</DialogDescription>

          {/* 👇 Conditional Rendering */}
          {useOfficeViewer && officeUrl ? (
            <iframe
              src={officeUrl}
              width="100%"
              height="100%"
              className="border-0"
              title="MS Word Preview"
            />
          ) : (
            <div ref={viewerRef} className="p-4 overflow-auto h-full text-xs" />
          )}
        </DialogContent>
      </Dialog>

      <div className="text-gray-500 text-xs">
        ✅ Review complete. Click <strong>Finish</strong> to save your offer template.
      </div>
    </div>
  );
}
