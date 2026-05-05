"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Plus, Search, Building, Users, TrendingUp, Loader2 } from 'lucide-react'
import { toast } from "sonner"
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/modules/hrm/hooks/hrmHooks"

interface Department {
  _id: string
  name?: string
  departmentName?: string
  description?: string
  head?: string | { name?: string; firstName?: string; lastName?: string; _id?: string }
  manager?: string | { name?: string; firstName?: string; lastName?: string; _id?: string }
  employees?: any[]
  status?: string
  budget?: string
  createdAt?: string
}

function getDepartmentName(dept: Department): string {
  return dept.name || dept.departmentName || "Unnamed"
}

function getHeadName(dept: Department): string {
  const headOrManager = dept.head || dept.manager
  if (!headOrManager) return "Not Assigned"
  if (typeof headOrManager === "string") return headOrManager
  if (headOrManager.name) return headOrManager.name
  if (headOrManager.firstName || headOrManager.lastName) {
    return `${headOrManager.firstName || ""} ${headOrManager.lastName || ""}`.trim()
  }
  return "Not Assigned"
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase() || "?"
}

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

  // Form states
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formHead, setFormHead] = useState("")

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllDepartments()
      const data = response?.data?.departments || response?.data?.data || response?.data || []
      setDepartments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading departments:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormHead("")
    setSelectedDepartment(null)
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsAddOpen(true)
  }

  const handleOpenEdit = (dept: Department) => {
    setSelectedDepartment(dept)
    setFormName(getDepartmentName(dept))
    setFormDescription(dept.description || "")
    const head = dept.head || dept.manager
    if (typeof head === "string") {
      setFormHead(head)
    } else if (head && typeof head === "object") {
      setFormHead(head._id || head.name || "")
    } else {
      setFormHead("")
    }
    setIsEditOpen(true)
  }

  const handleOpenDelete = (dept: Department) => {
    setSelectedDepartment(dept)
    setIsDeleteOpen(true)
  }

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error("Department name is required")
      return
    }
    try {
      setSubmitting(true)
      await createDepartment({
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        head: formHead.trim() || undefined,
      })
      toast.success("Department created successfully")
      setIsAddOpen(false)
      resetForm()
      await fetchDepartments()
    } catch (err) {
      // Error toast is handled in the hook
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedDepartment || !formName.trim()) {
      toast.error("Department name is required")
      return
    }
    try {
      setSubmitting(true)
      await updateDepartment(selectedDepartment._id, {
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        head: formHead.trim() || undefined,
      })
      toast.success("Department updated successfully")
      setIsEditOpen(false)
      resetForm()
      await fetchDepartments()
    } catch (err) {
      // Error toast is handled in the hook
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDepartment) return
    try {
      setSubmitting(true)
      await deleteDepartment(selectedDepartment._id)
      toast.success("Department deleted successfully")
      setIsDeleteOpen(false)
      setSelectedDepartment(null)
      await fetchDepartments()
    } catch (err) {
      // Error toast is handled in the hook
    } finally {
      setSubmitting(false)
    }
  }

  const filteredDepartments = departments.filter(dept => {
    const name = getDepartmentName(dept).toLowerCase()
    const desc = (dept.description || "").toLowerCase()
    const term = searchTerm.toLowerCase()
    return name.includes(term) || desc.includes(term)
  })

  // Calculate stats from real data
  const totalDepartments = departments.length
  const totalEmployees = departments.reduce((sum, dept) => sum + (dept.employees?.length || 0), 0)
  const avgTeamSize = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0
  const activeDepartments = departments.filter(d => !d.status || d.status.toLowerCase() === "active").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage organizational departments and their structure
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              {activeDepartments} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTeamSize}</div>
            <p className="text-xs text-muted-foreground">
              Per department
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No departments found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term." : "Get started by adding your first department."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDepartments.map((department) => {
            const headName = getHeadName(department)
            const employeeCount = department.employees?.length || 0
            const status = department.status || "Active"

            return (
              <Card key={department._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={
                      status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }>
                      {status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(department)}>
                          Edit department
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleOpenDelete(department)}
                        >
                          Delete department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg">{getDepartmentName(department)}</CardTitle>
                  <CardDescription>{department.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={headName} />
                        <AvatarFallback>
                          {getInitials(headName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Department Head</div>
                        <div className="text-sm text-muted-foreground">{headName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Employees</div>
                      <div className="text-2xl font-bold">{employeeCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Budget</div>
                      <div className="text-2xl font-bold">{department.budget || "N/A"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Department Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>Create a new department in your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="add-name"
                placeholder="e.g. Engineering"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                placeholder="Brief description of the department"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-head">Department Head</Label>
              <Input
                id="add-head"
                placeholder="Head name or ID"
                value={formHead}
                onChange={(e) => setFormHead(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-head">Department Head</Label>
              <Input
                id="edit-head"
                value={formHead}
                onChange={(e) => setFormHead(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedDepartment ? getDepartmentName(selectedDepartment) : ""}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
