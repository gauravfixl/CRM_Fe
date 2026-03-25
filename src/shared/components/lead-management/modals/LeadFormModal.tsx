"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Lead } from '../LeadInboxTable'
import { Badge } from '@/shared/components/ui/badge'
import { X, User, Building, Mail, Globe, DollarSign, Tag as TagIcon } from 'lucide-react'

const leadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    company: z.string().min(2, "Company name is required"),
    source: z.string().min(1, "Source is required"),
    status: z.string().min(1, "Status is required"),
    stage: z.string().min(1, "Stage is required"),
    value: z.string().min(1, "Value is required"),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    ownerName: z.string().optional(),
    tags: z.array(z.string()).default([]),
})

type LeadFormValues = z.infer<typeof leadSchema>

interface LeadFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: LeadFormValues) => void
    initialData?: Lead | null
    title: string
    stages?: { id: string; title: string }[]
}

export function LeadFormModal({ isOpen, onClose, onSubmit, initialData, title, stages }: LeadFormModalProps) {
    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: '',
            email: '',
            company: '',
            source: 'Google',
            status: 'Active',
            stage: stages?.[0]?.id || 'new',
            value: '$0',
            priority: 'medium',
            ownerName: 'Unassigned',
            tags: [],
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                company: initialData.company,
                source: initialData.source,
                status: initialData.status,
                stage: initialData.stage,
                value: initialData.value,
                priority: (initialData as any).priority || 'medium',
                ownerName: initialData.ownerName || 'Unassigned',
                tags: initialData.tags || [],
            })
        } else {
            form.reset({
                name: '',
                email: '',
                company: '',
                source: 'Google',
                status: 'Active',
                stage: stages?.[0]?.id || 'new',
                value: '$0',
                priority: 'medium',
                ownerName: 'Unassigned',
                tags: [],
            })
        }
    }, [initialData, form, isOpen])

    const [tagInput, setTagInput] = React.useState("")

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            const currentTags = form.getValues('tags')
            if (!currentTags.includes(tagInput.trim())) {
                form.setValue('tags', [...currentTags, tagInput.trim()])
            }
            setTagInput("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        const currentTags = form.getValues('tags')
        form.setValue('tags', currentTags.filter(t => t !== tagToRemove))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-8 py-6 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input {...field} className="pl-10 h-11 border-slate-200 focus:ring-indigo-500 rounded-xl" placeholder="John Doe" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input {...field} className="pl-10 h-11 border-slate-200 focus:ring-indigo-500 rounded-xl" placeholder="john@example.com" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company & Source */}
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Company</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input {...field} className="pl-10 h-11 border-slate-200 focus:ring-indigo-500 rounded-xl" placeholder="Acme Corp" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Lead Source</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                <SelectItem value="Google">Google Search</SelectItem>
                                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                                <SelectItem value="Direct">Direct Traffic</SelectItem>
                                                <SelectItem value="Referral">Referral</SelectItem>
                                                <SelectItem value="Website">Website Form</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Pipeline Info */}
                            <FormField
                                control={form.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Lead Stage</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                                    <SelectValue placeholder="Select stage" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                {stages ? (
                                                    stages.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                                    ))
                                                ) : (
                                                    <>
                                                        <SelectItem value="Hot">🔥 Hot</SelectItem>
                                                        <SelectItem value="Warm">☀️ Warm</SelectItem>
                                                        <SelectItem value="Cold">❄️ Cold</SelectItem>
                                                        <SelectItem value="Closed Won">🏆 Closed Won</SelectItem>
                                                        <SelectItem value="Lost">❌ Lost</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Estimated Value</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input {...field} className="pl-10 h-11 border-slate-200 focus:ring-indigo-500 rounded-xl" placeholder="$0.00" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Priority Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                                    <SelectValue placeholder="Set priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                <SelectItem value="low">🟢 Low Priority</SelectItem>
                                                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                                                <SelectItem value="high">🔴 High Priority</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <FormLabel className="text-[12px] font-bold text-slate-500 uppercase">Tags</FormLabel>
                            <div className="flex flex-wrap gap-2 p-2 min-h-[44px] border border-slate-200 rounded-xl">
                                {form.watch('tags').map(tag => (
                                    <Badge key={tag} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-1 gap-1">
                                        {tag}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                    </Badge>
                                ))}
                                <input
                                    className="flex-1 outline-none text-[13px] bg-transparent min-w-[120px] ml-1"
                                    placeholder="Type and press Enter..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-100 -mx-8 px-8 bg-slate-50/50">
                            <Button type="button" variant="ghost" onClick={onClose} className="h-11 px-6 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md border-none">
                                {initialData ? 'Update Opportunity' : 'Create Opportunity'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
