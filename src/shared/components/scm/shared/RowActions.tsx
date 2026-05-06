"use client"

import * as React from "react"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface RowActionsProps {
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
    extraItems?: React.ReactNode
}

export function RowActions({ onView, onEdit, onDelete, extraItems }: RowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-slate-100"
                    aria-label="Row actions"
                >
                    <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {onView && (
                    <DropdownMenuItem onClick={onView} className="text-[13px] cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem onClick={onEdit} className="text-[13px] cursor-pointer">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                )}
                {extraItems}
                {onDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface DeleteConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    itemLabel: string
    onConfirm: () => void
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    title = "Delete this item?",
    itemLabel,
    onConfirm,
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="block">
                            You are about to delete{" "}
                            <span className="font-semibold text-[#0F172A]">{itemLabel}</span>. This
                            action cannot be undone.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
