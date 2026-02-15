"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Settings, Save, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import useStore from "@/lib/taxStore"

export default function CreateRolePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addRole, getAllPermissions } = useStore()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
    const [orgName, setOrgName] = useState("");

  const allPermissions = getAllPermissions()
useEffect(() => {
   const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);
  // Group permissions by module
  const permissionsByModule = allPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    },
    {} as Record<string, typeof allPermissions>,
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Role name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Role description is required"
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      addRole({
        name: formData.name.trim(),
        description: formData.description.trim(),
        isSystem: false,
        permissions: formData.permissions,
        userCount: 0,
      })

      toast({
        title: "Role Created",
        description: "New role has been successfully created.",
      })

      router.push(`/${orgName}/modules/administration/roles`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permissionId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => id !== permissionId),
      }))
    }
  }

  const handleModulePermissionToggle = (modulePermissions: typeof allPermissions, checked: boolean) => {
    const modulePermissionIds = modulePermissions.map((p) => p.id)

    if (checked) {
      // Add all module permissions
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...modulePermissionIds])],
      }))
    } else {
      // Remove all module permissions
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !modulePermissionIds.includes(id)),
      }))
    }
  }

  const isModuleFullySelected = (modulePermissions: typeof allPermissions) => {
    return modulePermissions.every((p) => formData.permissions.includes(p.id))
  }

  const isModulePartiallySelected = (modulePermissions: typeof allPermissions) => {
    return (
      modulePermissions.some((p) => formData.permissions.includes(p.id)) && !isModuleFullySelected(modulePermissions)
    )
  }

  const getSelectedPermissionsByModule = () => {
    const selectedPermissions = allPermissions.filter((p) => formData.permissions.includes(p.id))

    return selectedPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.module]) {
          acc[permission.module] = []
        }
        acc[permission.module].push(permission)
        return acc
      },
      {} as Record<string, typeof allPermissions>,
    )
  }

  return (
    <div className="space-y-6 add-role">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/${orgName}/modules/administration/roles`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
          <p className="text-muted-foreground">Create a custom role with specific permissions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>Provide basic information about the role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Role Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter role name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter role description"
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Permissions *</Label>
                      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Manage Permissions</DialogTitle>
                            <DialogDescription>Select permissions for this role by module</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                              <Card key={module}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={isModuleFullySelected(modulePermissions)}
                                      onCheckedChange={(checked) =>
                                        handleModulePermissionToggle(modulePermissions, checked as boolean)
                                      }
                                      className={
                                        isModulePartiallySelected(modulePermissions)
                                          ? "data-[state=checked]:bg-blue-600"
                                          : ""
                                      }
                                    />
                                    <CardTitle className="text-base">{module}</CardTitle>
                                    <Badge variant="outline">
                                      {modulePermissions.filter((p) => formData.permissions.includes(p.id)).length}/
                                      {modulePermissions.length}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    {modulePermissions.map((permission) => (
                                      <div key={permission.id} className="flex items-start space-x-2">
                                        <Checkbox
                                          checked={formData.permissions.includes(permission.id)}
                                          onCheckedChange={(checked) =>
                                            handlePermissionToggle(permission.id, checked as boolean)
                                          }
                                        />
                                        <div className="space-y-1 leading-none">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{permission.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {permission.action}
                                            </Badge>
                                          </div>
                                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setShowPermissionsDialog(false)}>
                              Done
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {errors.permissions && <p className="text-sm text-red-500 mt-1">{errors.permissions}</p>}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Link href={`/${orgName}/modules/administration/roles`}>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Creating..." : "Create Role"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Selected Permissions Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Selected Permissions</span>
              </CardTitle>
              <CardDescription>Preview of selected permissions ({formData.permissions.length})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(getSelectedPermissionsByModule()).length === 0 ? (
                  <div className="text-center py-4">
                    <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No permissions selected</p>
                    <p className="text-xs text-muted-foreground">Click "Manage Permissions" to select</p>
                  </div>
                ) : (
                  Object.entries(getSelectedPermissionsByModule()).map(([module, modulePermissions]) => (
                    <div key={module} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{module}</h4>
                        <Badge variant="outline" className="text-xs">
                          {modulePermissions.length}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {modulePermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="text-xs text-muted-foreground flex items-center justify-between"
                          >
                            <span>{permission.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
