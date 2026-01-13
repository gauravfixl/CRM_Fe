import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ColorTheme =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "violet"
  | "pink"
  | "lightblue"

export type DarkMode = "light" | "dark" | "system"

interface ThemeState {
  colorTheme: ColorTheme
  darkMode: DarkMode
  setColorTheme: (theme: ColorTheme) => void
  setDarkMode: (mode: DarkMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorTheme: "blue",
      darkMode: "light",
      setColorTheme: (theme) => {
        set({ colorTheme: theme })
        // Apply theme to document
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme)
        }
      },
      setDarkMode: (mode) => {
        set({ darkMode: mode })
        // Apply dark mode logic
        if (typeof window !== "undefined") {
          const root = window.document.documentElement
          root.classList.remove("light", "dark")

          if (mode === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.add(systemTheme)
          } else {
            root.classList.add(mode)
          }
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          // Apply saved theme on hydration
          document.documentElement.setAttribute("data-theme", state.colorTheme)

          const root = window.document.documentElement
          root.classList.remove("light", "dark")

          if (state.darkMode === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.add(systemTheme)
          } else {
            root.classList.add(state.darkMode)
          }
        }
      },
    },
  ),
)

export const themeConfig = {
  red: {
    name: "Red",
    description: "Energy • Passion • Danger",
    color: "hsl(0, 84%, 60%)",
    gradient: "linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 72%, 51%) 100%)",
  },
  orange: {
    name: "Orange",
    description: "Creativity • Youth • Enthusiasm",
    color: "hsl(25, 95%, 53%)",
    gradient: "linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(21, 90%, 48%) 100%)",
  },
  // yellow: {
  //   name: "Yellow",
  //   description: "Happiness • Hope • Spontaneity",
  //   color: "hsl(48, 96%, 53%)",
  //   gradient: "linear-gradient(135deg, hsl(48, 96%, 53%) 0%, hsl(45, 93%, 47%) 100%)",
  // },
  // green: {
  //   name: "Green",
  //   description: "Nature • Growth • Wealth",
  //   color: "hsl(142, 76%, 36%)",
  //   gradient: "linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 72%, 29%) 100%)",
  // },
  blue: {
    name: "Blue",
    description: "Calm • Trust • Intelligence",
    color: "hsl(221, 83%, 53%)",
    gradient: "linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(224, 76%, 48%) 100%)",
  },
  // violet: {
  //   name: "Violet",
  //   description: "Luxury • Mystery • Spirituality",
  //   color: "hsl(262, 83%, 58%)",
  //   gradient: "linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(263, 70%, 50%) 100%)",
  // },
  pink: {
    name: "Pink",
    description: "Romance • Playful • Warmth",
    color: "hsl(330, 65%, 71%)", // #E586B3
    gradient: "linear-gradient(135deg, hsl(330, 65%, 71%) 0%, hsl(330, 70%, 65%) 100%)",
  },
  lightblue: {
    name: "Light Blue",
    description: "Fresh • Bright • Friendly",
    color: "hsl(194, 98%, 49%)", // #00C3F9
    gradient: "linear-gradient(135deg, hsl(194, 98%, 49%) 0%, hsl(194, 90%, 42%) 100%)",
  },
} as const
