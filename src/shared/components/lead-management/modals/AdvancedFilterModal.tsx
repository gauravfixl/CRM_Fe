
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { Slider } from "@/shared/components/ui/slider"

interface AdvancedFilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: any) => void
    currentFilters: any
}

export function AdvancedFilterModal({ isOpen, onClose, onApply, currentFilters }: AdvancedFilterModalProps) {
    const [filters, setFilters] = React.useState(currentFilters)

    const handleReset = () => {
        const resetFilters = {
            source: 'all',
            owner: 'all',
            status: 'all',
            scoreRange: [0, 100],
            minProjectValue: '',
        }
        setFilters(resetFilters)
        onApply(resetFilters)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-2xl overflow-hidden">
                <DialogHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                    <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Advanced Lead Filters</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase text-slate-400">Lead Source</Label>
                            <Select value={filters.source} onValueChange={(v) => setFilters({ ...filters, source: v })}>
                                <SelectTrigger className="h-10 border-slate-200">
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    <SelectItem value="Google">Google</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Website">Website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase text-slate-400">Account Owner</Label>
                            <Select value={filters.owner} onValueChange={(v) => setFilters({ ...filters, owner: v })}>
                                <SelectTrigger className="h-10 border-slate-200">
                                    <SelectValue placeholder="Select Owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Owners</SelectItem>
                                    <SelectItem value="Rajesh K.">Rajesh K.</SelectItem>
                                    <SelectItem value="Anita S.">Anita S.</SelectItem>
                                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-[11px] font-bold uppercase text-slate-400">Lead Quality Score</Label>
                            <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {filters.scoreRange?.[0] || 0} - {filters.scoreRange?.[1] || 100}
                            </span>
                        </div>
                        <Slider
                            defaultValue={filters.scoreRange}
                            max={100}
                            step={1}
                            onValueChange={(v) => setFilters({ ...filters, scoreRange: v })}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-400">Minimum Contract Value ($)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 10000"
                            value={filters.minProjectValue}
                            onChange={(e) => setFilters({ ...filters, minProjectValue: e.target.value })}
                            className="h-10 border-slate-200"
                        />
                    </div>
                </div>

                <DialogFooter className="bg-slate-50/50 p-6 border-t border-slate-100 gap-2">
                    <Button variant="ghost" onClick={handleReset} className="font-bold text-slate-500 rounded-xl">Reset All</Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={onClose} className="font-bold border-slate-200 rounded-xl">Cancel</Button>
                    <Button onClick={() => onApply(filters)} className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl px-8 shadow-lg shadow-indigo-100">Apply Filters</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
