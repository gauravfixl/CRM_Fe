"use client"

import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handleCreateTeam: (formData: { name: string; description: string }, boardType?: string | null) => void
}

export default function CreateTeamDialog({ open, onOpenChange, handleCreateTeam }: CreateTeamDialogProps) {
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [setupCustomBoard, setSetupCustomBoard] = useState("")
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [loadingBoard, setLoadingBoard] = useState(false)

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const resetForm = () => {
    setFormStep(1)
    setFormData({ name: "", description: "" })
    setSetupCustomBoard("")
    setShowTemplateModal(false)
    setLoadingBoard(false)
  }

  const handleBoardTemplateSelect = (type: string) => {
    setLoadingBoard(true)
    setTimeout(() => {
      setLoadingBoard(false)
      setShowTemplateModal(false)
      onOpenChange(false)
      handleCreateTeam(formData, type)
    }, 2000)
  }

  const handleDefaultBoardSetup = () => {
    setLoadingBoard(true)
    setShowTemplateModal(true)
    setTimeout(() => {
      setLoadingBoard(false)
      setShowTemplateModal(false)
      onOpenChange(false)
      handleCreateTeam(formData, "default")
    }, 2000)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold leading-tight">Create New Team</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Organize members under a team
            </DialogDescription>
          </DialogHeader>

          {formStep === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col">
                <Label className="mb-3">Team Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter team name"
                  className="py-2 px-3"
                />
                {!formData.name && (
                  <p className="text-red-500 text-sm mt-1">Team name is required</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label className="mb-3">Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  className="py-2 px-3"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    if (formData.name.trim() === "") return;
                    setFormStep(2);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-5">
              <Label className="block mb-2">Do you want to setup a custom board?</Label>
              <RadioGroup onValueChange={setSetupCustomBoard} value={setupCustomBoard} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>

              <div className="flex justify-end gap-3 mt-2">
                <Button variant="outline" onClick={() => setFormStep(1)}>Back</Button>
                {setupCustomBoard === "yes" ? (
                  <Button onClick={() => setShowTemplateModal(true)}>Next</Button>
                ) : (
                  <Button onClick={handleDefaultBoardSetup}>Submit</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold leading-tight">
              {loadingBoard
                ? setupCustomBoard === "yes"
                  ? "Setting up your board..."
                  : "Setting up default board..."
                : "Select a Board Template"}
            </DialogTitle>
            {!loadingBoard && (
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Choose between Kanban or Scrum
              </DialogDescription>
            )}
          </DialogHeader>

          {loadingBoard ? (
            <div className="flex items-center justify-center h-40 gap-2">
              <Loader2 className="animate-spin w-6 h-6" />
              <span className="text-sm text-muted-foreground">
                {setupCustomBoard === "yes"
                  ? "Setting up your board..."
                  : "Setting up default board..."}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div
                className="cursor-pointer border rounded-lg p-4 hover:bg-muted"
                onClick={() => handleBoardTemplateSelect("kanban")}
              >
                <img src="/kanban-preview.png" alt="Kanban" className="w-full h-24 object-cover mb-2 rounded" />
                <p className="text-center font-medium">Kanban</p>
              </div>
              <div
                className="cursor-pointer border rounded-lg p-4 hover:bg-muted"
                onClick={() => handleBoardTemplateSelect("scrum")}
              >
                <img src="/scrum-preview.png" alt="Scrum" className="w-full h-24 object-cover mb-2 rounded" />
                <p className="text-center font-medium">Scrum</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
