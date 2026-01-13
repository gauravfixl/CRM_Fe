import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"

export default function ConditionalAccessPage() {
    return (
        <div className="p-6">
            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Conditional Access Policies</FlatCardTitle>
                    <FlatCardDescription>Define and manage access policies for your organization resources.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent>
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-lg border border-dashed">
                        <h3 className="text-lg font-medium">No Policies Created</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            Create policies to automatically enforce security requirements like MFA based on user signal.
                        </p>
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
