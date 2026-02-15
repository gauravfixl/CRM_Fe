"use client"

import React, { useState, useEffect } from "react"
import { useDocumentStore, Document } from "@/shared/data/document-store"
import {
    FileText,
    Image as ImageIcon,
    File as FileIcon,
    Trash2,
    Download,
    MoreHorizontal,
    CloudIcon,
    FileImage,
    FileVideo,
    FileArchive,
    Search,
    Filter,
    Plus,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import FileUploadButton from "./file-upload-button"

interface TaskDocumentsProps {
    taskId: string;
}

export default function TaskDocuments({ taskId }: TaskDocumentsProps) {
    const { fetchDocuments, deleteDocument, isUploading, uploadProgress } = useDocumentStore()
    const [documents, setDocuments] = useState<Document[]>([])
    const [isDragging, setIsDragging] = useState(false)

    // Sync with store
    const storeDocuments = fetchDocuments(taskId)

    useEffect(() => {
        setDocuments(storeDocuments)
    }, [storeDocuments.length])

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return <FileImage size={24} className="text-pink-500" />
        if (type.includes("pdf")) return <FileText size={24} className="text-rose-500" />
        if (type.includes("video")) return <FileVideo size={24} className="text-purple-500" />
        if (type.includes("zip") || type.includes("rar")) return <FileArchive size={24} className="text-amber-500" />
        return <FileIcon size={24} className="text-slate-400" />
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        // Drag-drop logic would call uploadFile similarly to FileUploadButton
    }

    const handleDelete = async (e: React.MouseEvent, docId: string) => {
        e.stopPropagation()
        if (confirm("Delete this document permanently?")) {
            await deleteDocument(docId)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Tactical Assets</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total {documents.length} files attached</p>
                </div>
                <FileUploadButton taskId={taskId} />
            </div>

            {/* Drag & Drop Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative h-32 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer
                    ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-100 bg-slate-50/30 hover:border-indigo-200 hover:bg-white'}
                `}
            >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all
                    ${isDragging ? 'bg-indigo-600 text-white animate-bounce' : 'bg-white text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 shadow-sm'}
                `}>
                    <CloudIcon size={20} />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest transition-all
                    ${isDragging ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-600'}
                `}>
                    {isDragging ? 'Drop to upload' : 'Drag & Drop files here'}
                </p>
            </div>

            {/* Files List */}
            <div className="space-y-4">
                {documents.length === 0 && !isUploading[taskId] ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                        <FileIcon size={48} className="text-slate-200 mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-10 leading-tight">No documents have been<br />linked to this item yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="group flex items-center gap-4 p-4 bg-white rounded-3xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50/50 transition-colors">
                                    {getFileIcon(doc.type)}
                                </div>

                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="text-[14px] font-black text-slate-700 uppercase tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                                        {doc.name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatSize(doc.size)}</span>
                                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.uploaderName}</span>
                                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDistanceToNow(new Date(doc.createdAt))} ago</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl">
                                        <Download size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => handleDelete(e, doc.id)}
                                        className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
