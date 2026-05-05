
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { X, Plus, Hash } from "lucide-react"
import { Input } from "@/shared/components/ui/input"

interface BatchTaggingModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (tags: string[]) => void
    selectedCount: number
}

const PRESET_TAGS = ["Enterprise", "VIP", "SaaS", "Startup", "Finance", "Healthcare", "Follow-up", "Urgent"]

export function BatchTaggingModal({ isOpen, onClose, onConfirm, selectedCount }: BatchTaggingModalProps) {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])
    const [customTag, setCustomTag] = React.useState("")

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const addCustomTag = () => {
        if (customTag && !selectedTags.includes(customTag)) {
            setSelectedTags([...selectedTags, customTag])
            setCustomTag("")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-2xl overflow-hidden">
                <DialogHeader className="bg-slate-50 p-6 border-b border-slate-100 italic">
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Hash className="h-5 w-5 text-indigo-600" /> Batch Tag Management
                    </DialogTitle>
                    <p className="text-[12px] text-slate-500 font-medium">Adding tags to {selectedCount} selected records.</p>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase text-slate-400">Popular Labels</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-2 ${selectedTags.includes(tag)
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase text-slate-400">New Category</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type new tag name..."
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                                className="h-10 border-slate-200"
                            />
                            <Button onClick={addCustomTag} className="bg-slate-900 hover:bg-black text-white px-4">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <Label className="text-[11px] font-black uppercase text-slate-400">Items to Append</Label>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                    <Badge key={tag} className="bg-indigo-50 border-indigo-200 text-indigo-600 px-2 py-1 flex items-center gap-1">
                                        {tag}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button variant="outline" onClick={onClose} className="flex-1 font-bold border-slate-200 rounded-xl h-11">Discard</Button>
                    <Button
                        disabled={selectedTags.length === 0}
                        onClick={() => onConfirm(selectedTags)}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl h-11 shadow-lg shadow-indigo-100"
                    >
                        Apply to {selectedCount} Leads
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
