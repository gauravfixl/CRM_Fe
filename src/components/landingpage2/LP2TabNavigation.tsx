"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useActiveSection } from "./hooks/useActiveSection"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "solutions", label: "Solutions" },
  { id: "product-demos", label: "Product demos" },
  { id: "automation", label: "Automation" },
  { id: "apps-addons", label: "Apps and add-ons" },
  { id: "customer-stories", label: "Customer stories" },
  { id: "security", label: "Security" },
  { id: "featured-news", label: "Featured news" },
  { id: "next-steps", label: "Next steps" },
]

const TAB_BAR_HEIGHT = 48
const SCROLL_OFFSET = TAB_BAR_HEIGHT + 8

export default function LP2TabNavigation() {
  const activeSection = useActiveSection()
  const navBarRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const naturalTop = useRef<number | null>(null)

  useEffect(() => {
    // Calculate the natural position of this tab bar in the page
    const calcTop = () => {
      if (navBarRef.current && !isSticky) {
        naturalTop.current = navBarRef.current.getBoundingClientRect().top + window.scrollY
      }
    }
    calcTop()

    const onScroll = () => {
      if (naturalTop.current === null) calcTop()
      if (naturalTop.current !== null) {
        setIsSticky(window.scrollY >= naturalTop.current)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", calcTop)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", calcTop)
    }
  }, [isSticky])

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (!el) return

    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top, behavior: "smooth" })
  }, [])

  return (
    <>
      {/* Placeholder to prevent layout jump when bar becomes fixed */}
      {isSticky && <div style={{ height: TAB_BAR_HEIGHT }} aria-hidden />}

      {/* Tab navigation bar */}
      <nav
        ref={navBarRef}
        className={`
          w-full bg-white border-b border-[#E5E5E5] z-40
          transition-shadow duration-200
          ${
            isSticky
              ? "fixed left-0 right-0 shadow-sm"
              : "relative"
          }
        `}
        style={isSticky ? { top: 0 } : undefined}
      >
        <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between"
          style={{ height: TAB_BAR_HEIGHT }}
        >
          {/* Tabs */}
          <div className="flex items-center gap-8 lg:gap-10 h-full overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`
                    relative whitespace-nowrap h-full flex items-center
                    text-[14px] cursor-pointer transition-colors duration-150
                    ${
                      isActive
                        ? "text-[#1A1A1A] font-semibold"
                        : "text-[#505050] font-normal hover:text-[#1A1A1A]"
                    }
                  `}
                >
                  {tab.label}

                  {isActive && (
                    <motion.span
                      layoutId="tab-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0067B8] rounded-t-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* CTA button */}
          <button
            className="
              ml-6 shrink-0 bg-[#1A1A1A] text-white
              px-5 py-2 text-[13px] font-semibold rounded-sm
              hover:bg-[#333] transition-colors duration-150
              cursor-pointer
            "
          >
            Try for free
          </button>
        </div>
      </nav>
    </>
  )
}
