"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Search, Filter, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomTable, CustomTableBody, CustomTableCell, CustomTableHead, CustomTableHeader, CustomTableRow } from "@/components/custom/CustomTable"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogTrigger,
} from "@/components/custom/CustomDialog"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "@/components/custom/CustomSelect"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { useToast } from "@/hooks/use-toast"
import { showError, showSuccess } from "@/utils/toast"
import { getAllFirmsList } from "@/hooks/firmHooks"
import { addGlobalTax, addFirmTax, updateTax, getAllOrgTaxes, enableTax, disableTax } from "@/hooks/taxHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "@/components/custom/Permission"

export default function TaxManagementPage() {
  const { toast } = useToast()
  const { showLoader, hideLoader } = useLoaderStore()

  const [taxes, setTaxes] = useState<any[]>([])
  const [firms, setFirms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTax, setEditingTax] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "gst",
    scope: "global",
    firmId: "",
    rate: "",
    description: "",
  })

  useEffect(() => {
    fetchFirms()
    fetchTaxes()
  }, [])

  const fetchFirms = async () => {
    try {
      const res = await getAllFirmsList()
      setFirms(res.data?.firms || [])
    } catch (err) {
      console.error("Failed to load firms", err)
    }
  }

  const fetchTaxes = async () => {
    try {
      showLoader()
      const response = await getAllOrgTaxes()
      const rawTaxes = response.data.data || []
      const normalized = rawTaxes.flatMap((taxObj: any) =>
        (taxObj.taxRates || []).map((rate: any) => ({
          id: rate._id,
          parentId: taxObj.id,
          firmId: taxObj.firmId,
          scope: taxObj.isGlobal ? "global" : "firm",
          name: rate.name,
          rate: rate.rate,
          description: rate.description,
          isEnabled: rate.isEnabled,
          type: rate.name.toLowerCase().includes("gst") ? "gst" : "custom"
        }))
      )
      setTaxes(normalized)
    } catch (err) {
      console.error("Error fetching taxes:", err)
    } finally {
      hideLoader()
    }
  }

  const filteredTaxes = useMemo(() => {
    let filtered = taxes
    if (activeTab === "global") filtered = filtered.filter(t => t.scope === "global")
    if (activeTab === "firm") filtered = filtered.filter(t => t.scope === "firm")
    if (activeTab === "gst") filtered = filtered.filter(t => t.type === "gst")
    if (activeTab === "custom") filtered = filtered.filter(t => t.type === "custom")

    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(t => t.name.toLowerCase().includes(s) || (t.description || "").toLowerCase().includes(s))
    }
    return filtered
  }, [taxes, activeTab, searchTerm])

  const handleCreateTax = async () => {
    if (!formData.name || !formData.rate) return showError("Name and Rate are required")
    try {
      showLoader()
      const rateObj = { name: formData.name, rate: Number(formData.rate), description: formData.description }
      if (formData.scope === "firm") {
        await addFirmTax({ firmId: formData.firmId, taxRates: [rateObj] })
      } else {
        await addGlobalTax({ taxRates: [rateObj] })
      }
      showSuccess("Tax created successfully")
      setIsCreateDialogOpen(false)
      fetchTaxes()
    } catch (err) {
      showError("Failed to create tax")
    } finally {
      hideLoader()
    }
  }

  const handleEditTax = async () => {
    if (!formData.rate) return showError("Rate is required")
    try {
      showLoader()
      await updateTax({ taxId: editingTax.id, rate: Number(formData.rate) })
      showSuccess("Tax updated successfully")
      setIsEditDialogOpen(false)
      fetchTaxes()
    } catch (error) {
      showError("Failed to update tax")
    } finally {
      hideLoader()
    }
  }

  const handleToggleTax = async (tax: any) => {
    try {
      showLoader()
      if (tax.isEnabled) await disableTax(tax.id)
      else await enableTax(tax.id)
      showSuccess(`Tax ${tax.isEnabled ? "disabled" : "enabled"} successfully`)
      fetchTaxes()
    } catch (err) {
      showError("Failed to toggle tax status")
    } finally {
      hideLoader()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Configure global and firm-specific taxes</p>
        </div>
        <Permission module="tax" action="CREATE_TAX">
          <CustomButton onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus size={16} /> Create Tax
          </CustomButton>
        </Permission>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Taxes", val: taxes.length },
          { label: "Global", val: taxes.filter(t => t.scope === "global").length },
          { label: "Firm Specific", val: taxes.filter(t => t.scope === "firm").length },
          { label: "Enabled", val: taxes.filter(t => t.isEnabled).length },
        ].map((s, i) => (
          <SmallCard key={i}>
            <SmallCardHeader className="pb-2"><SmallCardTitle className="text-sm">{s.label}</SmallCardTitle></SmallCardHeader>
            <SmallCardContent><div className="text-2xl font-bold">{s.val}</div></SmallCardContent>
          </SmallCard>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <CustomInput placeholder="Search taxes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="firm">Firm</TabsTrigger>
            <TabsTrigger value="gst">GST</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <SmallCard>
        <CustomTable>
          <CustomTableHeader>
            <CustomTableRow>
              <CustomTableHead>Tax Name</CustomTableHead>
              <CustomTableHead>Scope</CustomTableHead>
              <CustomTableHead>Rate (%)</CustomTableHead>
              <CustomTableHead>Status</CustomTableHead>
              <CustomTableHead className="text-right">Actions</CustomTableHead>
            </CustomTableRow>
          </CustomTableHeader>
          <CustomTableBody>
            {filteredTaxes.map(tax => (
              <CustomTableRow key={tax.id}>
                <CustomTableCell>
                  <div className="font-medium">{tax.name}</div>
                  <div className="text-xs text-muted-foreground">{tax.description || "No description"}</div>
                </CustomTableCell>
                <CustomTableCell><Badge variant="outline">{tax.scope}</Badge></CustomTableCell>
                <CustomTableCell>{tax.rate}%</CustomTableCell>
                <CustomTableCell>
                  <Badge variant={tax.isEnabled ? "default" : "secondary"}>{tax.isEnabled ? "Active" : "Inactive"}</Badge>
                </CustomTableCell>
                <CustomTableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CustomButton variant="ghost" size="sm" onClick={() => { setEditingTax(tax); setFormData({ ...formData, rate: tax.rate }); setIsEditDialogOpen(true); }}><Edit size={14} /></CustomButton>
                    <CustomButton variant="ghost" size="sm" onClick={() => handleToggleTax(tax)}>
                      {tax.isEnabled ? <ToggleRight size={18} className="text-primary" /> : <ToggleLeft size={18} className="text-muted-foreground" />}
                    </CustomButton>
                  </div>
                </CustomTableCell>
              </CustomTableRow>
            ))}
          </CustomTableBody>
        </CustomTable>
      </SmallCard>

      <CustomDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Create New Tax</CustomDialogTitle></CustomDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <CustomLabel>Scope</CustomLabel>
                <CustomSelect value={formData.scope} onValueChange={v => setFormData({ ...formData, scope: v })}>
                  <CustomSelectTrigger><CustomSelectValue /></CustomSelectTrigger>
                  <CustomSelectContent><CustomSelectItem value="global">Global</CustomSelectItem><CustomSelectItem value="firm">Firm</CustomSelectItem></CustomSelectContent>
                </CustomSelect>
              </div>
              <div className="space-y-1">
                <CustomLabel>Rate (%)</CustomLabel>
                <CustomInput type="number" value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} />
              </div>
            </div>
            {formData.scope === "firm" && (
              <div className="space-y-1">
                <CustomLabel>Firm</CustomLabel>
                <CustomSelect value={formData.firmId} onValueChange={v => setFormData({ ...formData, firmId: v })}>
                  <CustomSelectTrigger><CustomSelectValue placeholder="Select Firm" /></CustomSelectTrigger>
                  <CustomSelectContent>{firms.map(f => <CustomSelectItem key={f._id} value={f._id}>{f.FirmName}</CustomSelectItem>)}</CustomSelectContent>
                </CustomSelect>
              </div>
            )}
            <div className="space-y-1">
              <CustomLabel>Name</CustomLabel>
              <CustomInput value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <CustomLabel>Description</CustomLabel>
              <CustomTextarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>
          <CustomDialogFooter>
            <CustomButton variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={handleCreateTax}>Create</CustomButton>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      <CustomDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Edit Tax Rate</CustomDialogTitle></CustomDialogHeader>
          <div className="py-4 space-y-2">
            <CustomLabel>Rate (%) for {editingTax?.name}</CustomLabel>
            <CustomInput type="number" value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} />
          </div>
          <CustomDialogFooter>
            <CustomButton variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={handleEditTax}>Update</CustomButton>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  )
}
