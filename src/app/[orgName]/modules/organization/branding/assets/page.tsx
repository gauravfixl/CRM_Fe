"use client"

import React, { useState } from "react"
import {
    Image as ImageIcon,
    Upload,
    Download,
    MoreVertical,
    Filter,
    Search,
    Trash2,
    Eye,
    Plus,
    FileText,
    Palette,
    Share2,
    Link as LinkIcon,
    X,
    FileImage
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const initialAssets = [
    { id: 1, name: "Main Logo - Dark.svg", type: "Vector", size: "45 KB", resolution: "Scalable", category: "Logos" },
    { id: 2, name: "Favicon-32x32.png", type: "Raster", size: "2 KB", resolution: "32x32", category: "Icons" },
    { id: 3, name: "Marketing Banner - Q1.jpg", type: "Raster", size: "2.4 MB", resolution: "1920x1080", category: "Campaigns" },
    { id: 4, name: "Brand Guidelines.pdf", type: "Document", size: "12 MB", resolution: "N/A", category: "Legal" },
    { id: 5, name: "Mobile App Icon.svg", type: "Vector", size: "12 KB", resolution: "Scalable", category: "Logos" },
]

export default function BrandAssetsLibrary() {
    const [assets, setAssets] = useState(initialAssets)
    const [searchQuery, setSearchQuery] = useState("")
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = (formData.get("fileName") as string) || "New Asset.png"

        const newAsset = {
            id: assets.length + 1,
            name: name,
            type: "Raster",
            size: "1.2 MB",
            resolution: "1024x1024",
            category: (formData.get("category") as string) || "General"
        }

        toast.promise(new Promise(res => setTimeout(res, 1800)), {
            loading: "Uploading and generating multi-resolution previews...",
            success: () => {
                setAssets([newAsset, ...assets])
                setIsUploadOpen(false)
                return `${name} deployed to CDN.`
            },
            error: "Upload failed. Check connection."
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brand Assets Library</h1>
                    <p className="text-sm text-slate-500 mt-1">Institutional repository for verified logos, color palettes, and marketing collateral.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Creating public sharing link...")}>
                        <Share2 className="w-4 h-4" />
                        Share Library
                    </Button>
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl shadow-blue-500/20">
                                <Plus className="w-4 h-4" />
                                Add New Asset
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
                            <div className="bg-blue-600 p-8 text-white relative">
                                <FileImage className="w-12 h-12 text-white/20 absolute right-4 top-4" />
                                <DialogTitle className="text-2xl font-black">Asset Ingestion</DialogTitle>
                                <p className="text-blue-100 text-xs font-medium mt-1">Upload verified brand assets to the global nexus.</p>
                            </div>
                            <form onSubmit={handleUpload} className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50">
                                        <Upload className="w-8 h-8 text-slate-300 mx-auto" />
                                        <p className="text-xs font-bold text-slate-500 mt-2">Browse files to upload</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</Label>
                                        <Input name="fileName" placeholder="e.g. Hero_Banner_v2.png" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Category</Label>
                                        <Select name="category" defaultValue="Logos">
                                            <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Logos">Institutional Logos</SelectItem>
                                                <SelectItem value="Icons">System Icons</SelectItem>
                                                <SelectItem value="Campaigns">Marketing Collateral</SelectItem>
                                                <SelectItem value="Legal">Brand Governance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-blue-100">
                                        Deploy to Library
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Library</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{assets.length} Assets</p>
                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">840 MB utilized</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vector Data</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">60%</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">SVG / AI formats</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-amber-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync Nodes</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-amber-600">12/12</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Active propagation</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-purple-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Download Hits</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-purple-600">2.4k</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">In last 30 days</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search assets by filename..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                        <Filter className="w-4 h-4" />
                        Logos Only
                    </Button>
                    <Separator orientation="vertical" className="h-6 hidden md:block" />
                    <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                        <Download className="w-4 h-4" />
                        Bulk Export
                    </Button>
                </div>
            </div>

            {/* ASSET GRID - LUXURY PRESENTATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-10">
                {filteredAssets.map((asset) => (
                    <Card key={asset.id} className="group border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all rounded-3xl overflow-hidden bg-white">
                        <div className="aspect-square bg-slate-50 border-b border-slate-100 relative group-hover:bg-blue-50/30 transition-colors flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-200 group-hover:text-blue-500 transition-colors" />
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-white/80 backdrop-blur-md text-[9px] font-black text-slate-600 border-none shadow-sm uppercase tracking-widest">{asset.category}</Badge>
                            </div>
                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                        </div>
                        <CardContent className="p-4">
                            <h4 className="text-xs font-black text-slate-900 truncate" title={asset.name}>{asset.name}</h4>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{asset.type} • {asset.size}</span>
                                <Badge variant="secondary" className="text-[9px] font-bold bg-slate-100 text-slate-500 border-none">{asset.resolution}</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="p-2 pt-0 flex gap-1">
                            <Button variant="ghost" className="flex-1 h-8 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600">
                                <Eye className="w-3 h-3 mr-1.5" /> Preview
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500">
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
