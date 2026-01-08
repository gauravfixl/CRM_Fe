"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { MoreHorizontal, Search, RotateCcw, Trash2, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Permission } from "@/components/custom/Permission"

export default function DeletedClientsPage() {
  const router = useRouter()
  const { clients, restoreClient } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const deletedClients = clients.filter((client) => client.deleted)

  const filteredClients = deletedClients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRestore = () => {
    if (selectedClientId) {
      restoreClient(selectedClientId)
      toast({
        title: "Success",
        description: "Client restored successfully",
      })
      setRestoreDialogOpen(false)
      setSelectedClientId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/modules/crm/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deleted Clients</h1>
          <p className="text-muted-foreground">Manage and restore deleted clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deleted Clients ({deletedClients.length})</CardTitle>
          <CardDescription>View and restore clients that have been deleted</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deleted clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Deleted Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.firstName}</div>
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{client.contactPerson.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    {/* <TableCell>{client.industry}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)} variant="secondary">
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${client.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(client.updatedAt), "MMM dd, yyyy")}
                      </span>
                    </TableCell> */}
                    <Permission module="client" action="RESTORE_CLIENT">
                    <TableCell>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedClientId(client.id)
                              setRestoreDialogOpen(true)
                            }}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    </Permission>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredClients.length === 0 && (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <Trash2 className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {deletedClients.length === 0 ? "No deleted clients found" : "No clients match your search"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this client? The client will be moved back to the active clients list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>Restore Client</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
