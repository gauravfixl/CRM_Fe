// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Key, Mail, Shield, CheckCircle2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { supportOrgLogin,getSupportClients,getSupportFirms,getSupportLeads,getSupportOrg } from "@/hooks/supportHooks"

// interface AccessRequestModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// interface Module {
//   id: string
//   name: string
//   description: string
//   icon: React.ElementType
//   available: boolean
// }

// const availableModules: Module[] = [
//   {
//     id: "firms",
//     name: "Firms",
//     description: "Manage firms",
//     icon: Mail,
//     available: true,
//   },
//   {
//     id: "clients",
//     name: "Clients",
//     description: "Add, edit, and manage organization client",
//     icon: Shield,
//     available: true,
//   },
//   {
//     id: "leads",
//     name: "Leads",
//     description: "Access leads",
//     icon: Mail,
//     available: true,
//   },
//   {
//     id: "invoices",
//     name: "Invoices",
//     description: "VIew and access invoices",
//     icon: Key,
//     available: false,
//   },
//   {
//     id: "taxes",
//     name: "Taxes",
//     description: "View taxes",
//     icon: Mail,
//     available: false,
//   },
//   {
//     id: "org",
//     name: "Organizations",
//     description: "View organization data ",
//     icon: Shield,
//     available: true,
//   },
// ]

// export default function AccessRequestModal({ isOpen, onClose }: AccessRequestModalProps) {
//   const [step, setStep] = useState<"request" | "modules">("request")
//   const [formData, setFormData] = useState({
//     email: "",
//     accessToken: "",
//     reason: "",
//   })
//   const [selectedModules, setSelectedModules] = useState<string[]>([])

// const handleSendRequest = async () => {
//   if (!formData.email || !formData.accessToken) return

//   try {
//     const response = await supportOrgLogin({
//       email: formData.email,
//       token: formData.accessToken,
//     })

//     console.log("Support Org Login Response:", response.data)

//     // If login successful → go to modules
//     setStep("modules")
//   } catch (error: any) {
//     console.error("Support Org Login failed:", error)
//     alert(error.response?.data?.message || "Failed to request access")
//   }
// }

// const handleModuleAccess = async (moduleId: string) => {
//   try {
//     let response;
//     switch(moduleId) {
//       case "firms":
//         response = await getSupportFirms();
//         break;
//       case "org":
//         response = await getSupportOrg();
//         break;
//       case "leads":
//         response = await getSupportLeads();
//         break;
//       case "clients":
//         response = await getSupportClients();
//         break;
//       default:
//         console.warn("No API defined for module:", moduleId);
//         return;
//     }

//     console.log(`Data for ${moduleId}:`, response.data);

//     // Here you can update state or navigate to module page
//     // For example, you could store it in state:
//     // setSelectedModuleData(response.data);

//     // Close modal if needed
//     onClose();

//   } catch (error: any) {
//     console.error(`Error fetching ${moduleId}:`, error);
//     alert(error.response?.data?.message || `Failed to fetch ${moduleId}`);
//   }
// };


//   const handleReset = () => {
//     setStep("request")
//     setFormData({ email: "", accessToken: "", reason: "" })
//     setSelectedModules([])
//   }

//   const handleClose = () => {
//     handleReset()
//     onClose()
//   }



//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         {step === "request" ? (
//           <>
//             <DialogHeader>
//               <DialogTitle>Request Organization Access</DialogTitle>
//               <DialogDescription>
//                 Enter your email and access token provided by the organization admin to request support access.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Your Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="token">Access Token</Label>
//                 <Input
//                   id="token"
//                   type="password"
//                   placeholder="Enter access token from admin"
//                   value={formData.accessToken}
//                   onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
//                 />
//                 <p className="text-xs text-gray-500">
//                   The access token should be provided by the organization administrator
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="reason">Reason for Access (Optional)</Label>
//                 <Textarea
//                   id="reason"
//                   placeholder="Briefly describe why you need access..."
//                   value={formData.reason}
//                   onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                   className="min-h-[80px]"
//                 />
//               </div>
//               <div className="flex gap-2 pt-4">
//                 <Button
//   className="flex-1"
//   onClick={handleSendRequest}
//   disabled={!formData.email || !formData.accessToken}
// >
//   <Key className="h-4 w-4 mr-2" />
//   Send Request
// </Button>

//                 <Button variant="outline" onClick={handleClose}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <CheckCircle2 className="h-5 w-5 text-green-600" />
//                 Access Granted - Available Modules
//               </DialogTitle>
//               <DialogDescription>
//                 You now have access to the following modules. Click on any module to access it directly.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {availableModules.map((module) => {
//                   const IconComponent = module.icon
//                   return (
//                     <Card
//                       key={module.id}
//                       className={`cursor-pointer transition-all hover:shadow-md ${
//                         module.available
//                           ? "hover:bg-blue-50 border-blue-200"
//                           : "opacity-50 cursor-not-allowed bg-gray-50"
//                       }`}
//                       onClick={() => module.available && handleModuleAccess(module.id)}
//                     >
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <CardTitle className="text-base flex items-center gap-2">
//                             <IconComponent className="h-4 w-4" />
//                             {module.name}
//                           </CardTitle>
//                           <Badge
//                             variant={module.available ? "default" : "secondary"}
//                             className={module.available ? "bg-green-100 text-green-800" : ""}
//                           >
//                             {module.available ? "Available" : "Restricted"}
//                           </Badge>
//                         </div>
//                       </CardHeader>
//                       <CardContent>
//                         <CardDescription className="text-sm">{module.description}</CardDescription>
//                         {module.available && (
//                           <Button
//                             size="sm"
//                             className="mt-3 w-full"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleModuleAccess(module.id)
//                             }}
//                           >
//                             Access Module
//                           </Button>
//                         )}
//                       </CardContent>
//                     </Card>
//                   )
//                 })}
//               </div>
//               <div className="flex gap-2 pt-6">
//                 <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
//                   Request New Access
//                 </Button>
//                 <Button onClick={handleClose} className="flex-1">
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import type React from "react"
import { useState } from "react"
import { Key, Mail, Shield, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supportOrgLogin,getSupportClients,getSupportFirms,getSupportLeads,getSupportOrg } from "@/hooks/supportHooks"
import { useSupportAccess } from "@/contexts/AuthContext"

interface AccessRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Module {
  id: string
  name: string
  description: string
  icon: React.ElementType
  available: boolean
}

const availableModules: Module[] = [
  { id: "firms", name: "Firms", description: "Manage firms", icon: Mail, available: true },
  { id: "clients", name: "Clients", description: "Add, edit, and manage organization client", icon: Shield, available: true },
  { id: "leads", name: "Leads", description: "Access leads", icon: Mail, available: true },
  { id: "invoices", name: "Invoices", description: "VIew and access invoices", icon: Key, available: false },
  { id: "taxes", name: "Taxes", description: "View taxes", icon: Mail, available: false },
  { id: "org", name: "Organizations", description: "View organization data ", icon: Shield, available: true },
]

export default function AccessRequestModal({ isOpen, onClose }: AccessRequestModalProps) {
  const [step, setStep] = useState<"request" | "modules">("request")
  const [formData, setFormData] = useState({ email: "", accessToken: "", reason: "" })
  const [selectedModules, setSelectedModules] = useState<string[]>([])
const { setAccessibleModules } = useSupportAccess()
  const handleSendRequest = async () => {
    if (!formData.email || !formData.accessToken) return

    console.log("Attempting Support Org Login with:", formData)

    try {
      const response = await supportOrgLogin({
        email: formData.email,
        token: formData.accessToken,
      })

      console.log("Support Org Login Response:", response.data)

      // If login successful → go to modules
      setStep("modules")
      console.log("Step set to 'modules'")
    } catch (error: any) {
      console.error("Support Org Login failed:", error)
      alert(error.response?.data?.message || "Failed to request access")
    }
  }


const handleModuleAccess = async (moduleId: string) => {
  try {
    let response;
    switch(moduleId) {
      case "firms": response = await getSupportFirms(); break
      case "org": response = await getSupportOrg(); break
      case "leads": response = await getSupportLeads(); break
      case "clients": response = await getSupportClients(); break
      default: return
    }

    console.log(`Data for ${moduleId}:`, response.data)

    // Update accessible modules in context
    setAccessibleModules((prev) => [...prev, moduleId])
    console.log("Updated accessible modules:", [...selectedModules, moduleId])

    // Close modal if needed
    onClose()
  } catch (error: any) {
    console.error(`Error fetching ${moduleId}:`, error)
    alert(error.response?.data?.message || `Failed to fetch ${moduleId}`)
  }
}

  const handleReset = () => {
    console.log("Resetting modal to request step")
    setStep("request")
    setFormData({ email: "", accessToken: "", reason: "" })
    setSelectedModules([])
  }

  const handleClose = () => {
    console.log("Closing modal")
    handleReset()
    onClose()
  }

  console.log("Modal render — step:", step, "selectedModules:", selectedModules)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "request" ? (
          <>
            <DialogHeader>
              <DialogTitle>Request Organization Access</DialogTitle>
              <DialogDescription>
                Enter your email and access token provided by the organization admin to request support access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Access Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter access token from admin"
                  value={formData.accessToken}
                  onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe why you need access..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleSendRequest}
                  disabled={!formData.email || !formData.accessToken}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Access Granted - Available Modules
              </DialogTitle>
              <DialogDescription>
                You now have access to the following modules. Click on any module to access it directly.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModules.map((module) => {
                  const IconComponent = module.icon
                  console.log("Rendering module card:", module.id, "available:", module.available)
                  return (
                    <Card
                      key={module.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        module.available
                          ? "hover:bg-blue-50 border-blue-200"
                          : "opacity-50 cursor-not-allowed bg-gray-50"
                      }`}
                      onClick={() => module.available && handleModuleAccess(module.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {module.name}
                          </CardTitle>
                          <Badge
                            variant={module.available ? "default" : "secondary"}
                            className={module.available ? "bg-green-100 text-green-800" : ""}
                          >
                            {module.available ? "Available" : "Restricted"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                        {module.available && (
                          <Button
                            size="sm"
                            className="mt-3 w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleModuleAccess(module.id)
                            }}
                          >
                            Access Module
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <div className="flex gap-2 pt-6">
                <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                  Request New Access
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
