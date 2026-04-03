"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useActiveSection } from "./hooks/useActiveSection"

const tabs = [
  { id: "overview", label: "Overview", color: "#F0F9FF" }, // Light blue
  { id: "solutions", label: "Solutions", color: "#FEF3C7" }, // Light yellow
  { id: "product-demos", label: "Product demos", color: "#ECFDF5" }, // Light green
  { id: "automation", label: "Automation", color: "#FCE7F3" }, // Light pink
  { id: "apps-addons", label: "Apps and add-ons", color: "#F3E8FF" }, // Light purple
  { id: "customer-stories", label: "Customer stories", color: "#FEF2F2" }, // Light red
  { id: "security", label: "Security", color: "#DBEAFE" }, // Light blue-gray
  { id: "featured-news", label: "Featured news", color: "#FEF3C7" }, // Light amber
  { id: "next-steps", label: "Next steps", color: "#E0F2FE" }, // Light sky
]

const TAB_BAR_HEIGHT = 48
const SCROLL_OFFSET = TAB_BAR_HEIGHT + 8

export default function LP2TabNavigation() {
  const activeSection = useActiveSection()
  const navBarRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [currentBgColor, setCurrentBgColor] = useState("#FFFFFF")
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
        const isNowSticky = window.scrollY >= naturalTop.current
        setIsSticky(isNowSticky)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", calcTop)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", calcTop)
    }
  }, [isSticky])

  // Update background color based on active section
  useEffect(() => {
    const activeTab = tabs.find(tab => tab.id === activeSection)
    if (activeTab && isSticky) {
      setCurrentBgColor(activeTab.color)
    } else {
      setCurrentBgColor("#FFFFFF")
    }
  }, [activeSection, isSticky])

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
          w-full border-b border-[#E5E5E5] z-40
          ${isSticky
            ? "fixed left-0 right-0 shadow-sm"
            : "relative"
          }
        `}
        style={{
          top: isSticky ? 0 : undefined,
          backgroundColor: currentBgColor,
          transition: 'background-color 0.5s ease-in-out',
        }}
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
                    ${isActive
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
