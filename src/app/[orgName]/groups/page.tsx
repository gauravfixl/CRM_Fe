import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"

export default function GroupsPage() {
    return (
        <div className="p-6">
            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Groups</FlatCardTitle>
                    <FlatCardDescription>Manage your organization's user groups.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent>
                    <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No groups found. This module is under construction.
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
