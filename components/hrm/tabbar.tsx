import React, { useState } from "react";

interface TabBarProps {
  tabs: string[];
  onTabChange?: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="w-full flex justify-start border-b border-gray-300 bg-white text-[13px] ">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-3 py-2 transition-all duration-150
            ${
              activeTab === tab
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-500"
            }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute left-1/2 -bottom-[1px] h-[2px] w-3 bg-blue-600 rounded-full transform -translate-x-1/2"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
