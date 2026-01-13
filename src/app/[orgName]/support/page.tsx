import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Support & Troubleshooting</FlatCardTitle>
                    <FlatCardDescription>Get help with your organization's resources.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all">
                            <h3 className="font-semibold mb-2">Documentation</h3>
                            <p className="text-sm text-muted-foreground">Read our guides and API reference.</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all">
                            <h3 className="font-semibold mb-2">Community Forum</h3>
                            <p className="text-sm text-muted-foreground">Ask questions and share ideas.</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all">
                            <h3 className="font-semibold mb-2">Contact Support</h3>
                            <p className="text-sm text-muted-foreground">Open a ticket with our engineering team.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <h3 className="font-medium mb-4">Quick Diagnostic Tools</h3>
                        <Button>Run Health Check</Button>
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
