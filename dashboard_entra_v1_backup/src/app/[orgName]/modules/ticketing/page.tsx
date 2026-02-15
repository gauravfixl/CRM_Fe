// app/support/page.jsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function TicketDashboard() {
  const [formData, setFormData] = useState({
    module: "",
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    type: "",
    tags: "",
  });

  const [tickets, setTickets] = useState([
    {
      id: "1312312",
      title: "Unable to assign lead",
      description: "Dropdown for assigning leads is empty.",
      status: "open",
      priority: "medium",
      module: "Lead",
      assignedTo: "Howard Stem",
      createdAt: "2 days ago",
    },
    {
      id: "1312313",
      title: "Settlement delayed",
      description: "Settlement is pending even after submission.",
      status: "pending",
      priority: "high",
      module: "Finance",
      assignedTo: "Administrator",
      createdAt: "1 day ago",
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const members = ["Howard Stem", "Administrator", "Unassigned"];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: Date.now().toString(),
      tags: formData.tags.split(",").map((tag) => tag.trim()) as any,
      createdAt: "Just now",
      assignedTo: "Unassigned",
    };
    setTickets([payload, ...tickets]);
  };

  const openUpdateModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const openViewPanel = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsViewPanelOpen(true);
  };

  return (
    <div className="flex h-screen">
      <div className="p-6 transition-all duration-300 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-xl font-semibold text-primary">All Tickets</h6>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <CustomButton className="bg-primary text-white hover:bg-primary/90">
                  Raise New Request
                </CustomButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Create New Ticket</DialogTitle>
                  <DialogDescription>Fill out the details below to raise a new support ticket.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="module">Module</Label>
                    <CustomInput id="module" name="module" placeholder="lead" value={formData.module} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <CustomInput id="title" name="title" placeholder="Unable to assign lead to user" value={formData.title} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe the issue..." value={formData.description} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, status: value })} defaultValue={formData.status}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, priority: value })} defaultValue={formData.priority}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <CustomInput id="type" name="type" placeholder="bug, feature, query" value={formData.type} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <CustomInput id="tags" name="tags" placeholder="assignment, dropdown, urgent" value={formData.tags} onChange={handleChange} />
                  </div>
                  <DialogFooter>
                    <CustomButton type="button" variant="outline" onClick={() => setFormData({ module: "", title: "", description: "", status: "open", priority: "medium", type: "", tags: "", })}>Reset</CustomButton>
                    <CustomButton type="submit" className="bg-primary text-white">Create Ticket</CustomButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <SmallCard key={ticket.id}>
              <SmallCardHeader className="flex flex-row justify-between items-start">
                <div>
                  <SmallCardTitle className="text-base font-semibold text-gray-800">{ticket.title}</SmallCardTitle>
                  <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400">{ticket.createdAt}</span>
                  <DropdownMenu open={openDropdownId === ticket.id} onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? ticket.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0zm-6 0a2 2 0 114 0 2 2 0 01-4 0z" />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white shadow rounded-md py-1">
                      <DropdownMenuItem onClick={() => openUpdateModal(ticket)}>Update</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteModal(ticket)}>Delete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openViewPanel(ticket)}>View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SmallCardHeader>
              <SmallCardContent className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${ticket.priority === "high" ? "bg-red-100 text-red-600" : ticket.priority === "medium" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#{ticket.id.slice(-4)}</span>
              </SmallCardContent>
            </SmallCard>
          ))}
        </div>
      </div>

      {isViewPanelOpen && (
        <div className="flex-[0_0_30%] bg-white shadow-xl p-6 overflow-auto transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedTicket?.title}</h3>
            <CustomButton variant="outline" onClick={() => setIsViewPanelOpen(false)}>Close</CustomButton>
          </div>
          <div className="space-y-2">
            <p><strong>Module:</strong> {selectedTicket?.module}</p>
            <p><strong>Status:</strong> {selectedTicket?.status}</p>
            <p><strong>Priority:</strong> {selectedTicket?.priority}</p>
            <p><strong>Assigned To:</strong> {selectedTicket?.assignedTo}</p>
            <p><strong>Description:</strong> {selectedTicket?.description}</p>
            <p><strong>Tags:</strong> {selectedTicket?.tags?.join(", ")}</p>
          </div>
        </div>
      )}

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Ticket Assignment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Label>Assign To</Label>
            <Select value={selectedTicket?.assignedTo || ""} onValueChange={(value) => setSelectedTicket({ ...selectedTicket, assignedTo: value })}>
              <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
              <SelectContent>{members.map((member) => (<SelectItem key={member} value={member}>{member}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <CustomButton type="button" variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={() => { setTickets(tickets.map((t) => t.id === selectedTicket.id ? selectedTicket : t)); setIsUpdateModalOpen(false); }} className="bg-primary text-white">Update</CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="mb-4">Are you sure you want to delete ticket "<strong>{selectedTicket?.title}</strong>"?</p>
          <DialogFooter>
            <CustomButton type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={() => { setTickets(tickets.filter((t) => t.id !== selectedTicket.id)); setIsDeleteModalOpen(false); }} className="bg-red-600 text-white">Delete</CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
