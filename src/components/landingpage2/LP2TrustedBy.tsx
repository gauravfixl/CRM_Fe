"use client"

const logosRow1 = [
  "Acme Corp", "TechVault", "DataFlow", "CloudSync", "InnovateCo", "ScaleUp",
  "PrimeStack", "NexGen", "BluePrint", "SmartOps", "CodeCraft", "VelocityAI",
]

const logosRow2 = [
  "NexGen", "BluePrint", "SmartOps", "CodeCraft", "VelocityAI", "Acme Corp",
  "TechVault", "DataFlow", "CloudSync", "InnovateCo", "ScaleUp", "PrimeStack",
]

export default function LP2TrustedBy() {
  return (
    <section className="relative bg-white py-12 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-8">
        <p className="text-center text-[#6B6B6B] text-sm uppercase tracking-wider font-medium">
          Trusted by 10,000+ businesses worldwide
        </p>
      </div>

      {/* Row 1 - scrolls left */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-left">
          {[...logosRow1, ...logosRow1].map((name, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center h-12"
            >
              <span className="text-[#C5C7D0] text-xl font-bold tracking-tight whitespace-nowrap hover:text-[#1A1A1A] transition-colors duration-300 cursor-default select-none">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right */}
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-right">
          {[...logosRow2, ...logosRow2].map((name, i) => (
            <div
              key={`r2-${i}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center h-12"
            >
              <span className="text-[#C5C7D0] text-xl font-bold tracking-tight whitespace-nowrap hover:text-[#1A1A1A] transition-colors duration-300 cursor-default select-none">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 35s linear infinite;
        }
      `}} />
    </section>
  )
}