// "use client"

// import * as React from "react"
// import { Moon, Sun } from 'lucide-react'
// import { useTheme } from "next-themes"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function ThemeToggle() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// // }
"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeStore, themeConfig, type ColorTheme } from "@/lib/theme-store"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { colorTheme, setColorTheme } = useThemeStore()
  const [isColorDialogOpen, setIsColorDialogOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Prevent SSR mismatch flash
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleColorThemeChange = (newTheme: ColorTheme) => {
    setColorTheme(newTheme)
    setIsColorDialogOpen(false)
  }

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2">
    

      {/* --- Color Theme Dialog --- */}
      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
              style={{ background: themeConfig[colorTheme].color }}
            />
            <span className="sr-only">Change color theme</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Choose Color Theme
            </DialogTitle>
            <DialogDescription>
              Select a color theme that matches your style and preference.
            </DialogDescription>
          </DialogHeader>
            {/* --- Dark/Light/System Toggle --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light
            {theme === "light" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
            {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-slate-200 to-slate-800" />
            System
            {theme === "system" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.entries(themeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleColorThemeChange(key as ColorTheme)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  colorTheme === key
                    ? "border-primary shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className="w-12 h-12 rounded-full shadow-md"
                    style={{ background: config.gradient }}
                  />
                  <div className="text-center">
                    <div className="font-medium text-sm">{config.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {config.description}
                    </div>
                  </div>
                  {colorTheme === key && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <Badge variant="outline" className="text-xs">
              Current: {themeConfig[colorTheme].name}
            </Badge>
            <div className="text-xs text-muted-foreground">
              Theme will be applied instantly
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


// "use client"

// import * as React from "react"
// import { Moon, Sun, Palette, Check } from "lucide-react"
// import { useTheme } from "next-themes"
// import { useThemeStore, themeConfig, type ColorTheme } from "@/lib/theme-store"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"

// export function ThemeToggle() {
//   const { theme, resolvedTheme, setTheme } = useTheme() // add resolvedTheme
//   const { colorTheme, setColorTheme } = useThemeStore()
//   const [isColorDialogOpen, setIsColorDialogOpen] = React.useState(false)
//   const [mounted, setMounted] = React.useState(false)

//   // Wait for client-side mount to prevent dark flash
//   React.useEffect(() => {
//     setMounted(true)

//     console.log("ThemeToggle mounted")
//     console.log("theme:", theme)                 // "light" | "dark" | "system"
//     console.log("resolvedTheme:", resolvedTheme) // "light" | "dark"
//     console.log("colorTheme from store:", colorTheme)
//   }, [theme, resolvedTheme, colorTheme])

//   const handleColorThemeChange = (newTheme: ColorTheme) => {
//     console.log("Changing colorTheme to:", newTheme)
//     setColorTheme(newTheme)
//     setIsColorDialogOpen(false)
//   }

//   if (!mounted) return null // don't render until theme is ready

//   return (
//     <div className="flex items-center space-x-2">
//       {/* Color Theme Dialog */}
//       <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
//         <DialogTrigger asChild>
//           <Button variant="ghost" size="icon" className="relative">
//             <Palette className="h-[1.2rem] w-[1.2rem]" />
//             <div
//               className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
//               style={{ background: themeConfig[colorTheme].color }}
//             />
//             <span className="sr-only">Change color theme</span>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Palette className="h-5 w-5" />
//               Choose Color Theme
//             </DialogTitle>
//             <DialogDescription>
//               Select a color theme that matches your style and preference.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-4">
//             {Object.entries(themeConfig).map(([key, config]) => (
//               <button
//                 key={key}
//                 onClick={() => handleColorThemeChange(key as ColorTheme)}
//                 className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
//                   colorTheme === key
//                     ? "border-primary shadow-lg"
//                     : "border-border hover:border-primary/50"
//                 }`}
//               >
//                 <div className="flex flex-col items-center space-y-3">
//                   <div
//                     className="w-12 h-12 rounded-full shadow-md"
//                     style={{ background: config.gradient }}
//                   />
//                   <div className="text-center">
//                     <div className="font-medium text-sm">{config.name}</div>
//                     <div className="text-xs text-muted-foreground mt-1">
//                       {config.description}
//                     </div>
//                   </div>
//                   {colorTheme === key && (
//                     <div className="absolute top-2 right-2">
//                       <div className="bg-primary text-primary-foreground rounded-full p-1">
//                         <Check className="h-3 w-3" />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center justify-between pt-4 border-t">
//             <Badge variant="outline" className="text-xs">
//               Current: {themeConfig[colorTheme].name}
//             </Badge>
//             <div className="text-xs text-muted-foreground">Theme will be applied instantly</div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
