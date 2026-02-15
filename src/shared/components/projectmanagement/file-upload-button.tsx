"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, Plus } from "lucide-react"
import { useDocumentStore } from "@/shared/data/document-store"

interface FileUploadButtonProps {
    taskId: string;
    variant?: "default" | "outline" | "ghost" | "link";
    className?: string;
    onUploadComplete?: () => void;
}

export default function FileUploadButton({ taskId, variant = "outline", className, onUploadComplete }: FileUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadFile, isUploading, uploadProgress } = useDocumentStore()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]

        // Mock uploader info
        const uploader = { id: "u1", name: "Gaurav Garg" }

        try {
            await uploadFile(taskId, file, uploader)
            if (onUploadComplete) onUploadComplete()
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const uploading = isUploading[taskId]
    const progress = uploadProgress[taskId] || 0

    return (
        <div className={className}>
            <input
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
            />
            <Button
                variant={variant}
                disabled={uploading}
                onClick={handleClick}
                className="h-10 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest gap-2 bg-white hover:bg-slate-50 border-slate-200 transition-all active:scale-95"
            >
                {uploading ? (
                    <>
                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                        {progress}%
                    </>
                ) : (
                    <>
                        <Upload size={14} className="text-indigo-500" />
                        Attach Files
                    </>
                )}
            </Button>
        </div>
    )
}
