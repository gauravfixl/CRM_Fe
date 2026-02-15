
import React from "react";
import { Breadcrumb } from "./CustomBreadCrumb";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SubHeaderProps {
  title?: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  height?: string;
  paddingX?: string;
  rightControls?: React.ReactNode; // Buttons on right
}

const SubHeader: React.FC<SubHeaderProps> = ({
  title,
  description,
  breadcrumbItems,
  height = "h-48",
  paddingX = "px-6",
  rightControls,
}) => {
  return (
    <div className={`relative w-full ${height} shadow overflow-hidden mb-8`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "var(--header-image)" }}
      />

      {/* Content overlay */}
      <div className={`absolute inset-0 flex flex-col justify-center ${paddingX}`}>
        <div className="flex justify-between items-start">
          {/* Left side: breadcrumbs on top, then title */}
          <div className="flex flex-col">
            {breadcrumbItems && breadcrumbItems.length > 0 && (
              <div className="mb-2">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            )}
            {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
            {description && <p className="text-white/80 mt-1">{description}</p>}
          </div>

          {/* Right side: buttons / controls */}
          {rightControls && (
            <div className="flex items-center gap-2 mt-2">
              {rightControls}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
