// components/RightDrawer.tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // optional utility for merging classes

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
  footerActions?: {
    label: string;
    variant?: "default" | "outline";
    onClick: () => void;
  }[];
  className?: string;
}

export default function RightDrawer({
  open,
  onClose,
  title,
  children,
  showFooter = true,
  footerActions = [],
  className,
}: RightDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent
        className={cn(
          "p-4 max-w-lg ml-auto rounded-l-lg text-xs border-l shadow-md",
          className
        )}
      >
        <DrawerHeader className="pb-2 border-b">
          <DrawerTitle className="text-sm font-medium">{title}</DrawerTitle>
        </DrawerHeader>

        <div className="mt-3 overflow-y-auto max-h-[70vh]">{children}</div>

        {showFooter && (
          <div className="flex justify-end gap-2 mt-4 border-t pt-3">
            {footerActions.map((btn, i) => (
              <Button
                key={i}
                variant={btn.variant || "default"}
                size="sm"
                className="text-xs"
                onClick={btn.onClick}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
