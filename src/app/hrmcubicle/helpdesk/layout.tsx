"use client"

import React from "react";

const HelpdeskLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full bg-[#f8fafc]">
            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default HelpdeskLayout;
