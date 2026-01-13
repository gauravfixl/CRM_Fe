"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Users, Shield, Settings, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { decryptData } from "@/utils/crypto"
import { getAllRolesNPermissions, deleteRole } from "@/hooks/roleNPermissionHooks"
import useRolesStore from "@/lib/roleStore"
import { getRoles } from "@/hooks/userHooks"

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orgName, setOrgName] = useState("")
  const { toast } = useToast()

  const orgRoles = useRolesStore(state => state.roles?.organization) || []

  useEffect(() => {
    setOrgName(localStorage.getItem("orgName") || "")
    const fetchUserAndRoles = async () => {
      try {
        const scopeParams = { scope: "sc-org" as const }
        const rolesResp = await getAllRolesNPermissions(scopeParams)

        if (rolesResp?.data?.permissions && rolesResp?.data?.iv) {
          const decrypted = decryptData(rolesResp.data.permissions, rolesResp.data.iv)
          useRolesStore.getState().setRoles(prev => ({ ...prev, organization: decrypted }))
        }

        const simpleRolesResp = await getRoles(scopeParams)
        if (simpleRolesResp?.data?.roles && simpleRolesResp?.data?.iv) {
          const decryptedRoles = decryptData(simpleRolesResp.data.roles, simpleRolesResp.data.iv)
          useRolesStore.getState().setSimpleRoles(decryptedRoles)
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }
    fetchUserAndRoles()
  }, [])

  const filteredRoles = orgRoles.filter(
    (role: any) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const stats = {
    total: orgRoles.length,
    system: orgRoles.filter((r: any) => !r.isCustom).length,
    custom: orgRoles.filter((r: any) => r.isCustom).length,
    users: orgRoles.reduce((sum: number, r: any) => sum + (r.userCount || 0), 0)
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId)
      useRolesStore.getState().setRoles(prev => ({
        ...prev,
        organization: prev.organization.filter((r: any) => r._id !== roleId)
      }))
      toast({ title: "Success", description: "Role deleted successfully." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete role.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and their associated permissions</p>
        </div>
        <Link href={`/${orgName}/modules/administration/roles/create`}>
          <Button><Plus className="mr-2 h-4 w-4" /> Create Role</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Roles", value: stats.total, icon: Shield },
          { label: "System Roles", value: stats.system, icon: Settings },
          { label: "Custom Roles", value: stats.custom, icon: Users },
          { label: "Total Users", value: stats.users, icon: Users },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
          <CardDescription>Manage roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No roles found</TableCell></TableRow>
                ) : (
                  filteredRoles.map((role: any) => (
                    <TableRow key={role._id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell><Badge variant={role.isCustom ? "secondary" : "default"}>{role.isCustom ? "Custom" : "System"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.userCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> View ({role.permissions.length})</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Permissions for {role.name}</DialogTitle>
                              <DialogDescription>{role.description || "Role permissions"}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {role.permissions.map((perm: any) => (
                                <Card key={perm._id}>
                                  <CardHeader className="pb-3"><CardTitle className="text-base">{perm.module}</CardTitle></CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                      {perm.actions.map((action: string) => (
                                        <Badge key={action} variant="outline" className="text-xs">{action}</Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                            <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                          </Link>
                          {role.isCustom ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                  <AlertDialogDescription>Are you sure you want to delete "{role.name}"?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteRole(role._id)} className="bg-red-600">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3" />
                              <span>System</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
