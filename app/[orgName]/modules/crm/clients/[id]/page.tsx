"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { ArrowLeft, Mail, Phone, MapPin, Globe, Building, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react'
import Link from "next/link"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useState ,useEffect} from "react"
import { getClientById } from "@/hooks/clientHooks" // adjust import path
import { useLoaderStore } from "@/lib/loaderStore"
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

const getActivityIcon = (type: string) => {
  switch (type) {
    case "created":
      return "🆕"
    case "updated":
      return "✏️"
    case "deleted":
      return "🗑️"
    case "restored":
      return "♻️"
    case "email":
      return "📧"
    case "call":
      return "📞"
    case "meeting":
      return "🤝"
    case "note":
      return "📝"
    default:
      return "📋"
  }
}

export default function ClientDetailsPage() {
  const params = useParams();
  const [client, setClient] = useState<any>(null); // type as needed
  const [orgName, setOrgName]= useState("")
  const {showLoader,hideLoader}=useLoaderStore();
useEffect(() => {
   const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

useEffect(() => {
  const fetchClient = async () => {
    try {
      showLoader(); // <-- start loader
      const res = await getClientById(params.id as string);
      setClient(res.data.client); // adjust according to API response structure
    } catch (error) {
      console.error("Error fetching client:", error);
      setClient(null);
    } finally {
      hideLoader(); // <-- stop loader no matter what
    }
  };

  if (params.id) fetchClient();
}, [params.id]);

  // if (!client) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold">Client Not Found</h2>
  //         <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
  //         <Button asChild className="mt-4">
  //           <Link href={`/${orgName}/modules/crm/clients`}>
  //             <ArrowLeft className="mr-2 h-4 w-4" />
  //             Back to Clients
  //           </Link>
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6 client-details-page p-4">
     <div className="flex flex-col space-y-4">
  {/* Back Button */}
  <div>
    <Button variant="outline" size="sm" asChild>
      <Link href={`/${orgName}/modules/crm/clients`}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
    </Button>
  </div>

  {/* Client Info + Action Buttons */}
  <div className="flex items-center justify-between">
    {/* Client Info */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{client?.firstName}</h1>
      <p className="text-muted-foreground">Client Details & Activity</p>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center space-x-2">
      <Button variant="outline" asChild className="edit-client-btn">
        <Link href={`/${orgName}/modules/crm/clients/${client?._id}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </Link>
      </Button>
      <Button variant="destructive" className="delete-client-btn" >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Client
      </Button>
    </div>
  </div>
</div>


      <div className="grid gap-6 md:grid-cols-3 ">
        <div className="md:col-span-2 client-details">
          <Card >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={client?.firstName} />
                  <AvatarFallback className="text-lg">
                    {client?.firstName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{client?.firstName}</CardTitle>
                  <CardDescription className="text-lg">{client?.contactPerson?.name}</CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    {/* <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    <Badge variant="outline">{client.industry}</Badge> */}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client?.address?.address1}</span>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Firm: {client?.clientFirmName}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {client?.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={client?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {client?.website}
                      </a>
                    </div>
                  )}
                  {client?.taxId && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">GST: {client?.taxId}</span>
                    </div>
                  )}
                  {/* <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {/* <span className="text-sm">Last Contact: {client.lastContact}</span> */}
                  {/* </div> */} 
                </div>
              </div>
              {/* {client.notes && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 client-stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-medium">${client.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="font-medium">{client.projectsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(client.status)} variant="secondary">
                  {client.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Industry</span>
                <span className="font-medium">{client.industry}</span>
              </div>
            </CardContent> */}
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Since</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {format(new Date(client.createdAt), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.floor((new Date().getTime() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>

      <Tabs defaultValue="activity" className="w-full clieent-activity-tabs">
        <TabsList>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4 recent-activity-client">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Recent activities and interactions with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client?.activities && client?.activities.length > 0 ? (
                  client?.activities
                    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="text-lg">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(activity.performedAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">by {activity?.performedBy}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No activities recorded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 client-projects">
          <Card>
            <CardHeader>
              <CardTitle>Client Projects</CardTitle>
              <CardDescription>
                Projects associated with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No projects found for this client</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4 client-invoices">
          <Card>
            <CardHeader>
              <CardTitle>Client Invoices</CardTitle>
              <CardDescription>
                Invoices generated for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No invoices found for this client</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
