"use client"

import React, { useState } from "react"
import {
    File,
    Image as ImageIcon,
    Upload,
    Trash2,
    Download,
    Eye,
    Filter,
    Search,
    FolderOpen,
    FileText,
    X
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useDocumentStore, formatFileSize, getFileIcon, DocumentLevel, DocumentType } from "@/shared/data/document-store"
import { formatDistanceToNow } from "date-fns"

interface DocumentManagerProps {
    taskId?: string
    projectId?: string
    workspaceId?: string
    organizationId?: string
    level?: DocumentLevel
}

export default function DocumentManager({
    taskId,
    projectId,
    workspaceId,
    organizationId,
    level
}: DocumentManagerProps) {
    const { getDocuments, deleteDocument, getStorageUsage } = useDocumentStore()

    const [filterType, setFilterType] = useState<DocumentType | "ALL">("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [uploadData, setUploadData] = useState({ name: "", description: "" })

    const { uploadDocument } = useDocumentStore()

    const handleUpload = () => {
        if (!uploadData.name) return

        // Mock file upload logic
        const newDoc = {
            id: `doc-${Date.now()}`,
            name: uploadData.name,
            description: uploadData.description,
            type: "file" as DocumentType,
            uploadedAt: new Date().toISOString(),
            level: level || "project",
            file: {
                size: Math.floor(Math.random() * 5000000),
                format: "PDF",
                url: "#"
            },
            uploaderId: "u1",
            uploaderName: "You",
            uploaderAvatar: "",
            projectId,
            workspaceId,
            organizationId
        }

        // @ts-ignore - store types might vary slightly but this is safe for prototype
        // @ts-ignore - store types might vary slightly but this is safe for prototype
        uploadDocument(newDoc)
        setIsUploadOpen(false)
        setUploadData({ name: "", description: "" })
    }

    const documents = getDocuments({
        taskId,
        projectId,
        workspaceId,
        organizationId,
        ...(filterType !== "ALL" && { type: filterType })
    }).filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const storageInfo = organizationId ? getStorageUsage(organizationId) : null

    const handleDelete = (docId: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            deleteDocument(docId, "u1") // Replace with actual user ID
        }
    }

    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        } catch {
            return "recently"
        }
    }

    return (
        <div className="space-y-4 font-sans">
            {/* Header with Storage Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FolderOpen size={18} className="text-indigo-600" />
                    <h3 className="text-[15px] font-bold text-slate-900">Documents</h3>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border-none">
                        {documents.length} files
                    </Badge>
                </div>

                {storageInfo && (
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <span>{storageInfo.totalSizeMB} MB used</span>
                        <span className="text-slate-300">•</span>
                        <span>{storageInfo.totalDocuments} documents</span>
                    </div>
                )}
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 rounded-xl text-[12px] font-medium"
                    />
                </div>

                <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                    <SelectTrigger className="h-9 w-32 rounded-lg text-[11px] font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="ALL" className="text-[12px] font-medium">All Types</SelectItem>
                        <SelectItem value="file" className="text-[12px] font-medium">Files</SelectItem>
                        <SelectItem value="image" className="text-[12px] font-medium">Images</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={() => setIsUploadOpen(true)} className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold shadow-md shadow-indigo-100">
                    <Upload size={14} className="mr-2" />
                    Upload
                </Button>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-800">Upload Document</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-[11px] font-bold text-slate-500">Document Name</Label>
                            <Input
                                id="name"
                                value={uploadData.name}
                                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                                className="font-medium"
                                placeholder="e.g. Project Proposal"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc" className="text-[11px] font-bold text-slate-500">Description</Label>
                            <Textarea
                                id="desc"
                                value={uploadData.description}
                                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                className="font-medium"
                                placeholder="Optional description..."
                            />
                        </div>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <p className="text-xs font-semibold text-slate-500">Click to select file</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="font-bold text-slate-500">Cancel</Button>
                        <Button onClick={handleUpload} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Upload File</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Storage Usage Breakdown */}
            {storageInfo && (
                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 mb-1">Total</p>
                                <p className="text-[14px] font-bold text-slate-900">{storageInfo.totalSizeMB} MB</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 mb-1">Files</p>
                                <p className="text-[14px] font-bold text-blue-600">{storageInfo.byType.files.count}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 mb-1">Images</p>
                                <p className="text-[14px] font-bold text-purple-600">{storageInfo.byType.images.count}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 mb-1">Limit</p>
                                <p className="text-[14px] font-bold text-green-600">5 GB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Document List */}
            <div className="space-y-2">
                {documents.length === 0 ? (
                    <Card className="border-none shadow-sm rounded-2xl bg-slate-50">
                        <CardContent className="p-8 text-center">
                            <FileText size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-[13px] font-semibold text-slate-500">No documents found</p>
                            <p className="text-[11px] text-slate-400 mt-1">Upload files to get started</p>
                        </CardContent>
                    </Card>
                ) : (
                    documents.map((doc) => (
                        <Card
                            key={doc.id}
                            className={`border rounded-2xl transition-all hover:shadow-md ${doc.type === 'file'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-purple-50 border-purple-200'
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`p-3 rounded-xl border shadow-sm shrink-0 ${doc.type === 'file'
                                        ? 'bg-blue-100 border-blue-200'
                                        : 'bg-purple-100 border-purple-200'
                                        }`}>
                                        {doc.type === 'file' ? (
                                            <File size={20} className="text-blue-600" />
                                        ) : (
                                            <ImageIcon size={20} className="text-purple-600" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900 truncate">
                                                    {doc.name}
                                                </h4>
                                                {doc.description && (
                                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                        {doc.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 hover:bg-white"
                                                >
                                                    <Eye size={14} className="text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 hover:bg-white"
                                                >
                                                    <Download size={14} className="text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 hover:bg-white"
                                                    onClick={() => handleDelete(doc.id)}
                                                >
                                                    <Trash2 size={14} className="text-red-500" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap mt-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5 border border-white shadow-sm">
                                                    <AvatarImage src={doc.uploaderAvatar} />
                                                    <AvatarFallback className="text-[8px] font-bold bg-indigo-100 text-indigo-700">
                                                        {doc.uploaderName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[10px] font-semibold text-slate-600">
                                                    {doc.uploaderName}
                                                </span>
                                            </div>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {formatTime(doc.uploadedAt)}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <Badge className="bg-white text-slate-600 text-[9px] font-bold border border-slate-200 px-2 py-0">
                                                {formatFileSize((doc.file?.size || doc.image?.size || 0))}
                                            </Badge>
                                            <Badge className="bg-white text-slate-600 text-[9px] font-bold border border-slate-200 px-2 py-0">
                                                {doc.file?.format || doc.image?.format}
                                            </Badge>
                                            <Badge className={`text-[9px] font-bold px-2 py-0 ${doc.level === 'task' ? 'bg-green-100 text-green-700 border-green-200' :
                                                doc.level === 'project' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    doc.level === 'workspace' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                        'bg-orange-100 text-orange-700 border-orange-200'
                                                } border`}>
                                                {doc.level}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
