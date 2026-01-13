"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SmallCard, SmallCardContent, SmallCardDescription, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger } from "@/components/custom/CustomDialog"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { getMyWorkspaces, createWorkspace, deleteWorkspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import useRolesStore from "@/lib/roleStore"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import { FaTrash, FaUsers, FaCalendar, FaRocket } from "react-icons/fa"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { CustomDropdownMenu, CustomDropdownMenuContent, CustomDropdownMenuItem, CustomDropdownMenuTrigger } from "@/components/custom/CustomDropdownMenu"
import { MoreVertical, Grid, List, Plus, Settings, Sparkles } from "lucide-react"

export function WorkspaceSelection() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceDescription, setWorkspaceDescription] = useState("")
  const [orgName, setOrgName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const { showLoader, hideLoader } = useLoaderStore()
  const setRoles = useRolesStore((state) => state.setRoles)
  const [gridPage, setGridPage] = useState(1)
  const [tablePage, setTablePage] = useState(1)
  const [workspaceError, setWorkspaceError] = useState("")

  const gridItemsPerPage = 6
  const tableRowsPerPage = 5

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName")
    setOrgName(storedOrg || "")
  }, [])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      showLoader()
      try {
        const res = await getMyWorkspaces()
        setWorkspaces(res.data.workspaces || [])
      } catch (err) {
        console.error("Error fetching workspaces:", err)
      } finally {
        hideLoader()
      }
    }
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    const fetchWorkspaceRoles = async () => {
      try {
        const resp = await getAllRolesNPermissions({ scope: "sc-wrk" })
        if (resp?.data?.permissions && resp?.data?.iv) {
          const decrypted = decryptData(resp.data.permissions, resp.data.iv)
          setRoles((prev: any) => ({ ...prev, workspace: decrypted }))
        }
      } catch (err) {
        console.error("Error fetching workspace roles:", err)
      }
    }
    fetchWorkspaceRoles()
  }, [setRoles])

  useEffect(() => {
    setGridPage(1)
    setTablePage(1)
  }, [state.viewMode])

  const handleCreateWorkspace = async () => {
    setWorkspaceError("")
    if (!workspaceName.trim()) {
      setWorkspaceError("Workspace name is required")
      return
    }
    if (workspaceName.length > 10) {
      setWorkspaceError("Workspace name cannot exceed 10 characters")
      return
    }

    showLoader()
    try {
      const newWorkspace = await createWorkspace({
        name: workspaceName.trim(),
        description: workspaceDescription.trim(),
      })
      dispatch({ type: "CREATE_WORKSPACE", payload: newWorkspace.data.workspace })
      setIsCreateOpen(false)
      setWorkspaceName("")
      setWorkspaceDescription("")
      router.push(`/${orgName}/modules/workspaces/${newWorkspace.data.workspace._id}/dashboard`)
    } catch (err: any) {
      setWorkspaceError(err?.response?.data?.message || "Something went wrong. Please check if you have selected an organization.")
    } finally {
      hideLoader()
    }
  }

  const handleWorkspaceSettings = (workspaceId: string) => {
    router.push(`workspaces/${workspaceId}/settings`)
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    dispatch({ type: "SET_CURRENT_WORKSPACE", payload: workspaceId })
    router.push(`/${orgName}/modules/workspaces/${workspaceId}/dashboard`)
  }

  const handleDeleteWorkspace = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this workspace?")) return
    try {
      await deleteWorkspace(id)
      setWorkspaces((prev) => prev.filter((w) => w._id !== id))
    } catch (error) {
      console.error("Failed to delete workspace:", error)
    }
  }

  const filteredWorkspaces = workspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalGridPages = Math.ceil(filteredWorkspaces.length / gridItemsPerPage)
  const paginatedGridWorkspaces = filteredWorkspaces.slice(
    (gridPage - 1) * gridItemsPerPage,
    gridPage * gridItemsPerPage,
  )

  const totalTablePages = Math.ceil(filteredWorkspaces.length / tableRowsPerPage)
  const paginatedTableWorkspaces = filteredWorkspaces.slice(
    (tablePage - 1) * tableRowsPerPage,
    tablePage * tableRowsPerPage,
  )

  return (
    <div className="h-[85vh] bg-gradient-to-br bg-white p-6 workspace-selection-page flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r bg-primary p-4 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3"><FaRocket className="h-6 w-6" /></div>
                <h6 className="text-xl text-white">Your Workspaces</h6>
              </div>
              <p className="text-white text-sm">Choose your workspace to continue your journey or create something amazing</p>
              <div className="flex items-center gap-4 text-sm text-white">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-white">{workspaces.length} Active Workspaces</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1">
                <CustomButton variant="ghost" size="sm" onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "grid" })} className={`text-white hover:bg-white/20 ${state.viewMode === "grid" ? "bg-white/30" : ""}`}><Grid className="h-4 w-4" /></CustomButton>
                <CustomButton variant="ghost" size="sm" onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "table" })} className={`text-white hover:bg-white/20 ${state.viewMode === "table" ? "bg-white/30" : ""}`}><List className="h-4 w-4" /></CustomButton>
              </div>

              <CustomDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <CustomDialogTrigger asChild>
                  <CustomButton className="bg-white text-primary hover:bg-primary hover:text-white font-semibold shadow-lg">
                    <Plus className="mr-2 h-4 w-4" /> Create Workspace
                  </CustomButton>
                </CustomDialogTrigger>
                <CustomDialogContent className="sm:max-w-md">
                  <CustomDialogHeader><CustomDialogTitle className="text-2xl font-bold text-primary">Create New Workspace</CustomDialogTitle></CustomDialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Workspace Name</label>
                      <CustomInput className="border-primary focus:border-primary" placeholder="Enter workspace name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                      {workspaceError && <p className="text-xs text-red-500 mt-1">{workspaceError}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Description</label>
                      <CustomTextarea className="border-primary focus:border-primary" placeholder="Describe your workspace" value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-3">
                      <CustomButton variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</CustomButton>
                      <CustomButton onClick={handleCreateWorkspace} className="bg-primary text-white hover:bg-primary">Create Workspace</CustomButton>
                    </div>
                  </div>
                </CustomDialogContent>
              </CustomDialog>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-md mt-6">
        <CustomInput placeholder="Search workspaces..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-primary pl-10" />
      </div>

      <div className="mt-6 flex-1 overflow-auto">
        {filteredWorkspaces.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <DotLottieReact src="https://lottie.host/283c42c1-f109-4b8b-b14e-eacec1856581/VfI7hJkpmx.lottie" loop autoplay />
              <h3 className="text-xl font-semibold text-gray-700 mt-4">{searchQuery ? "No workspaces found" : "No workspaces yet"}</h3>
              <p className="text-gray-500 mt-2">{searchQuery ? "Try adjusting your search terms" : "Create your first workspace to get started!"}</p>
            </div>
          </div>
        ) : state.viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedGridWorkspaces.map((workspace) => {
              const projectCount = state.projects.filter((p) => p.workspaceId === workspace._id).length
              return (
                <SmallCard key={workspace._id} className="group relative cursor-pointer overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]" onClick={() => handleWorkspaceClick(workspace._id)}>
                  <SmallCardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br bg-primary text-white shadow-lg"><FaRocket className="h-5 w-5" /></div>
                        <div className="flex-1">
                          <SmallCardTitle className="text-lg text-gray-800 group-hover:text-primary transition-colors">{workspace.name}</SmallCardTitle>
                          <SmallCardDescription className="text-gray-600 mt-1 line-clamp-2">{workspace.description}</SmallCardDescription>
                        </div>
                      </div>
                      <CustomDropdownMenu>
                        <CustomDropdownMenuTrigger asChild><button className="p-2 rounded-full hover:bg-gray-100 transition-opacity" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4 text-gray-500" /></button></CustomDropdownMenuTrigger>
                        <CustomDropdownMenuContent align="end">
                          <CustomDropdownMenuItem onClick={(e) => { e.stopPropagation(); handleWorkspaceSettings(workspace._id); }}><Settings className="mr-2 h-4 w-4" />Settings</CustomDropdownMenuItem>
                          <CustomDropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteWorkspace(workspace._id, e)}><FaTrash className="mr-2 h-4 w-4" />Delete</CustomDropdownMenuItem>
                        </CustomDropdownMenuContent>
                      </CustomDropdownMenu>
                    </div>
                  </SmallCardHeader>
                  <SmallCardContent className="relative p-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1"><FaUsers className="h-3 w-3" /><span>5 members</span></div>
                        <div className="flex items-center gap-1"><FaCalendar className="h-3 w-3" /><span>{new Date(workspace.createdAt).toLocaleDateString()}</span></div>
                      </div>
                      <div className="primary font-medium">{projectCount} projects</div>
                    </div>
                  </SmallCardContent>
                </SmallCard>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border bg-white shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 border-b bg-white p-4 font-semibold text-primary">
              <div>Workspace</div><div>Projects</div><div>Created</div><div className="text-center">Actions</div>
            </div>
            {paginatedTableWorkspaces.map((workspace) => {
              const projectCount = state.projects.filter((p) => p.workspaceId === workspace._id).length
              return (
                <div key={workspace._id} className="grid cursor-pointer grid-cols-4 gap-4 border-b border-primary/70 p-4 transition-colors hover:bg-primary/30" onClick={() => handleWorkspaceClick(workspace._id)}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br bg-primary text-white"><FaRocket className="h-5 w-5" /></div>
                    <div>
                      <div className="text-lg text-gray-800 group-hover:text-primary transition-colors">{workspace.name}</div>
                      <div className="text-sm text-gray-500">{workspace.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-primary font-medium">{projectCount}</div>
                  <div className="flex items-center text-sm text-gray-500">{new Date(workspace.createdAt).toLocaleDateString()}</div>
                  <div className="flex justify-center items-center">
                    <CustomDropdownMenu>
                      <CustomDropdownMenuTrigger asChild><button className="p-2 transition-colors" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4 text-gray-500" /></button></CustomDropdownMenuTrigger>
                      <CustomDropdownMenuContent align="end">
                        <CustomDropdownMenuItem onClick={(e) => { e.stopPropagation(); handleWorkspaceSettings(workspace._id); }}><Settings className="mr-2 h-4 w-4" />Settings</CustomDropdownMenuItem>
                        <CustomDropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteWorkspace(workspace._id, e)}><FaTrash className="mr-2 h-4 w-4" />Delete</CustomDropdownMenuItem>
                      </CustomDropdownMenuContent>
                    </CustomDropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <CustomButton variant="outline" disabled={state.viewMode === "grid" ? gridPage === 1 : tablePage === 1} onClick={() => state.viewMode === "grid" ? setGridPage(gridPage - 1) : setTablePage(tablePage - 1)} className="border-primary text-primary hover:bg-primary">Previous</CustomButton>
        {state.viewMode === "grid" ? (
          <div className="flex items-center gap-2">
            {Array.from({ length: totalGridPages }, (_, i) => i + 1).map((page) => (
              <CustomButton key={page} variant={page === gridPage ? "default" : "outline"} size="sm" onClick={() => setGridPage(page)} className={page === gridPage ? "bg-primary text-white" : "border-primary text-primary hover:bg-primary"}>{page}</CustomButton>
            ))}
          </div>
        ) : (
          <span className="text-sm text-primary font-medium">Page {tablePage} of {totalTablePages}</span>
        )}
        <CustomButton variant="outline" disabled={state.viewMode === "grid" ? gridPage === totalGridPages : tablePage === totalTablePages} onClick={() => state.viewMode === "grid" ? setGridPage(gridPage + 1) : setTablePage(tablePage + 1)} className="border-primary text-primary hover:bg-primary">Next</CustomButton>
      </div>
    </div>
  )
}
