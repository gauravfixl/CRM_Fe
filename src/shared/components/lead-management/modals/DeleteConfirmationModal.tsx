"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    itemName?: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, description, itemName }: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-rose-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                        </DialogHeader>
                    </div>

                    <DialogDescription className="text-slate-500 text-[14px] leading-relaxed mb-8">
                        {description}
                        {itemName && (
                            <span className="block mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-700">
                                {itemName}
                            </span>
                        )}
                    </DialogDescription>

                    <DialogFooter className="gap-3 flex-col sm:flex-row">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 h-12 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 border-none gap-2"
                        >
                            <Trash2 className="h-4 w-4" /> Delete Permanently
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
