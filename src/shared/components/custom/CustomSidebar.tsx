"use client"

import * as React from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Drawer } from "vaul"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ----------------------
// Types
// ----------------------
interface WithChildren {
  children?: React.ReactNode
  className?: string
}

// ----------------------
// Context / Provider
// ----------------------
const SidebarContext = React.createContext<any>(null)

export function CustomSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = () => setOpen(prev => !prev)

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar, openMobile, setOpenMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useCustomSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useCustomSidebar must be used within CustomSidebarProvider")
  return ctx
}

// ----------------------
// Sidebar Root
// ----------------------
export const CustomSidebar = React.forwardRef<HTMLDivElement, WithChildren & { collapsible?: "none" | "icon"; mobile?: boolean }>(
  (
    { className, children, collapsible = "icon", mobile = true, ...props },
    ref
  ) => {
    const { open, openMobile, setOpenMobile } = useCustomSidebar()

    return (
      <>
        {/* Desktop Sidebar */}
        <Collapsible.Root ref={ref as any} asChild open={open} {...props}>
          <aside
            className={cn(
              "group flex flex-col border-r bg-background text-sm transition-all duration-300",
              "data-[state=closed]:w-[64px] data-[state=open]:w-[240px]",
              className
            )}
            style={{ zoom: "0.9" }}
          >
            {children}
          </aside>
        </Collapsible.Root>

        {/* Mobile Drawer */}
        {mobile && (
          <Drawer.Root open={openMobile} onOpenChange={setOpenMobile}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 flex h-[80%] flex-col rounded-t-2xl border bg-background p-4 shadow-lg">
                {children}
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </>
    )
  }
)
CustomSidebar.displayName = "CustomSidebar"

// ----------------------
// Header & Footer
// ----------------------
export const CustomSidebarHeader: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("flex items-center justify-between p-3 border-b", className)}>{children}</div>
)

export const CustomSidebarFooter: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("mt-auto p-3 border-t", className)}>{children}</div>
)

// ----------------------
// Groups & Labels
// ----------------------
export const CustomSidebarGroup: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("flex flex-col gap-1 p-2", className)}>{children}</div>
)

export const CustomSidebarGroupLabel: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("px-2 text-xs font-medium text-muted-foreground", className)}>{children}</div>
)

// ----------------------
// Menu & Items
// ----------------------
export const CustomSidebarMenu: React.FC<WithChildren> = ({ children, className }) => (
  <nav className={cn("flex flex-col gap-1", className)}>{children}</nav>
)

export const CustomSidebarMenuItem: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("flex items-center", className)}>{children}</div>
)

export const CustomSidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button> & { tooltip?: React.ReactNode }>(
  ({ className, children, tooltip, ...props }, ref) => {
    const { open } = useCustomSidebar()

    const button = (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        className={cn(
          "flex w-full items-center justify-start gap-2 px-3 py-2 font-normal",
          "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )

    if (!open && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      )
    }

    return button
  }
)
CustomSidebarMenuButton.displayName = "CustomSidebarMenuButton"

// ----------------------
// Submenu
// ----------------------
export const CustomSidebarMenuSub: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("ml-4 flex flex-col gap-1 border-l pl-2", className)}>{children}</div>
)

export const CustomSidebarMenuSubItem: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("flex items-center text-sm text-muted-foreground", className)}>{children}</div>
)

export const CustomSidebarMenuSubButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "flex w-full items-center justify-start gap-2 px-3 py-2 text-muted-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
)
CustomSidebarMenuSubButton.displayName = "CustomSidebarMenuSubButton"

// ----------------------
// Rail & Content
// ----------------------
export const CustomSidebarRail: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("w-[64px] flex-shrink-0 border-r bg-background", className)} />
)

export const CustomSidebarContent: React.FC<WithChildren> = ({ children, className }) => (
  <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
)

// ----------------------
// Trigger
// ----------------------
export const CustomSidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useCustomSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn("h-8 w-8 p-0", className)}
        {...props}
      >
        ☰
      </Button>
    )
  }
)
CustomSidebarTrigger.displayName = "CustomSidebarTrigger"