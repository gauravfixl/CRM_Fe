"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Users,
    Mail,
    Phone,
    Linkedin,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    ShieldCheck,
    Briefcase,
    MessageSquare,
    Star,
    ExternalLink
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"

// Types
interface Contact {
    id: number;
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
    type: 'Decision Maker' | 'Champion' | 'End User' | 'Influencer';
    lastContact: string;
}

const initialContacts: Contact[] = [
    { id: 1, name: "Sarah Jenkins", role: "CTO", company: "DataScale Inc", email: "sarah.j@datascale.com", phone: "+1 415-555-0123", type: "Decision Maker", lastContact: "2 days ago" },
    { id: 2, name: "Marcus Thorne", role: "Head of Growth", company: "Innova Hub", email: "m.thorne@innovahub.io", phone: "+1 212-555-0198", type: "Champion", lastContact: "5 hours ago" },
    { id: 3, name: "Elena Rodriguez", role: "Sr. Procurement", company: "Global Dynamics", email: "e.rodriguez@globald.com", phone: "+44 20-7946-0145", type: "Influencer", lastContact: "1 week ago" },
    { id: 4, name: "James Wilson", role: "IT Manager", company: "Swift Apps", email: "j.wilson@swiftapps.de", phone: "+49 30-1234567", type: "End User", lastContact: "3 days ago" },
    { id: 5, name: "Patricia Chen", role: "VP Marketing", company: "Horizon Media", email: "p.chen@horizon.au", phone: "+61 2-9876-5432", type: "Decision Maker", lastContact: "12 hours ago" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.blue
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", currentClasses.split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingContact, setEditingContact] = useState<Contact | null>(null)
    const { toast } = useToast()

    // Form states
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        role: '',
        company: '',
        email: '',
        phone: '',
        type: 'Champion',
        lastContact: 'Just now'
    })

    const metrics = useMemo(() => {
        const decisionMakers = contacts.filter(c => c.type === 'Decision Maker').length
        const champions = contacts.filter(c => c.type === 'Champion').length

        return {
            total: contacts.length,
            decisionMakers,
            champions,
            activeRate: "92%"
        }
    }, [contacts])

    const filteredContacts = useMemo(() => {
        return contacts.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase()) ||
            c.role.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        )
    }, [contacts, search])

    const handleDelete = (id: number) => {
        setContacts(prev => prev.filter(c => c.id !== id))
        toast({ title: "Contact Deleted", description: "The contact record has been removed." })
    }

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.company) return

        if (editingContact) {
            setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...formData } as Contact : c))
            toast({ title: "Contact Updated", description: "The contact details have been saved." })
        } else {
            const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1
            setContacts(prev => [...prev, { ...formData, id: newId } as Contact])
            toast({ title: "Contact Created", description: "New contact added successfully." })
        }
        setIsDialogOpen(false)
        setEditingContact(null)
        setFormData({ name: '', role: '', company: '', email: '', phone: '', type: 'Champion', lastContact: 'Just now' })
    }

    const openEdit = (contact: Contact) => {
        setEditingContact(contact)
        setFormData(contact)
        setIsDialogOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Contacts & <span className="text-violet-600">Key People</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Network intelligence of stakeholders, decision makers and platform champions.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingContact(null); setFormData({ name: '', role: '', company: '', email: '', phone: '', type: 'Champion', lastContact: 'Just now' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-violet-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Add New Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Full Name</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Role / Designation</Label>
                                    <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. CTO" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Company</Label>
                                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Email Address</Label>
                                    <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Phone Number</Label>
                                    <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234-567-890" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Relationship Type</Label>
                                <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger><SelectValue placeholder="Relationship" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                                        <SelectItem value="Champion">Champion</SelectItem>
                                        <SelectItem value="End User">End User</SelectItem>
                                        <SelectItem value="Influencer">Influencer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Contact
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Contact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Total Contacts" value={metrics.total} subValue="System-wide Network" icon={Users} color="blue" />
                <MetricBox title="Decision Makers" value={metrics.decisionMakers} subValue="Exec Level Stakeholders" icon={ShieldCheck} color="violet" />
                <MetricBox title=" champions" value={metrics.champions} subValue="Direct Platform Users" icon={Star} color="emerald" />
                <MetricBox title="Engagement Rate" value={metrics.activeRate} subValue="Last 30 Days" icon={MessageSquare} color="amber" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Stakeholder Directory</h2>
                        <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-bold font-outfit">{filteredContacts.length} people</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search contacts..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/10 w-full md:w-64 font-outfit"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl text-slate-400"><Filter className="h-4.5 w-4.5" /></Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                <th className="px-6 py-4">People</th>
                                <th className="px-6 py-4">Company & Role</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Relationship</th>
                                <th className="px-6 py-4">Last Sync</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                                <tr key={contact.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-violet-50 text-violet-600 font-bold text-xs">{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 font-outfit">{contact.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Linkedin className="h-3 w-3 text-slate-300 hover:text-blue-500 cursor-pointer" />
                                                    <p className="text-[10px] font-medium text-slate-400 font-outfit">LinkedIn Profile</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-800 font-outfit">{contact.company}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Briefcase className="h-3 w-3 text-slate-400" />
                                                <p className="text-[11px] font-medium text-slate-500 font-outfit">{contact.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-slate-400" />
                                                <span className="text-[11px] font-medium text-slate-600 font-outfit">{contact.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 text-slate-400" />
                                                <span className="text-[11px] font-medium text-slate-600 font-outfit">{contact.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-outfit border",
                                            contact.type === 'Decision Maker' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                contact.type === 'Champion' ? "bg-violet-50 text-violet-600 border-violet-100" :
                                                    "bg-slate-50 text-slate-600 border-slate-100"
                                        )}>
                                            {contact.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-bold text-slate-500 font-outfit">{contact.lastContact}</td>
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-violet-600 transition-colors">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => openEdit(contact)}>
                                                    <PencilLine className="h-4 w-4" /> Edit Contact
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                    <Mail className="h-4 w-4" /> Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer border-t mt-1">
                                                    <ExternalLink className="h-4 w-4" /> View Account
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer" onClick={() => handleDelete(contact.id)}>
                                                    <Trash2 className="h-4 w-4" /> Delete Record
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-sm font-bold text-slate-500 font-outfit">No people found.</p>
                                    </td>
                                    Full record successfully handled.
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
