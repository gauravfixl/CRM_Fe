import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"

export default function ApplicationsPage() {
    return (
        <div className="p-6">
            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Enterprise Applications</FlatCardTitle>
                    <FlatCardDescription>Manage applications and service principals.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent>
                    <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No applications configured.
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
