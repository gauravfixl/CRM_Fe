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
const NAVBAR_HEIGHT = 56 // LP2Navbar is fixed h-14 (56px)
const SCROLL_OFFSET = TAB_BAR_HEIGHT + NAVBAR_HEIGHT + 8

export default function LP2TabNavigation() {
  const activeSection = useActiveSection()
  const navBarRef = useRef<HTMLDivElement>(null)
  const tabsScrollRef = useRef<HTMLDivElement>(null)
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [isSticky, setIsSticky] = useState(false)
  const [currentBgColor, setCurrentBgColor] = useState("#FFFFFF")
  const naturalTop = useRef<number | null>(null)

  // Auto-scroll the tab strip so the active tab is centered in view
  useEffect(() => {
    if (!activeSection) return
    const activeBtn = tabButtonRefs.current[activeSection]
    const container = tabsScrollRef.current
    if (!activeBtn || !container) return

    const btnCenter = activeBtn.offsetLeft + activeBtn.offsetWidth / 2
    const target = btnCenter - container.clientWidth / 2
    container.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    })
  }, [activeSection])

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
        // Trigger sticky a bit earlier so the bar docks right under the fixed navbar
        const isNowSticky = window.scrollY + NAVBAR_HEIGHT >= naturalTop.current
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
          top: isSticky ? NAVBAR_HEIGHT : undefined,
          backgroundColor: currentBgColor,
          transition: 'background-color 0.5s ease-in-out',
        }}
      >
        <div className="mx-auto max-w-[1280px] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2"
          style={{ height: TAB_BAR_HEIGHT }}
        >
          {/* Tabs (horizontally scrollable on mobile) */}
          <div
            ref={tabsScrollRef}
            className="flex items-center gap-5 sm:gap-8 lg:gap-10 h-full overflow-x-auto scrollbar-hide flex-1 min-w-0 scroll-smooth"
          >
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  ref={(el) => { tabButtonRefs.current[tab.id] = el }}
                  onClick={() => scrollToSection(tab.id)}
                  className={`
                    relative whitespace-nowrap h-full flex items-center shrink-0
                    text-[12px] sm:text-[14px] cursor-pointer transition-colors duration-150
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
        </div>
      </nav>
    </>
  )
}
