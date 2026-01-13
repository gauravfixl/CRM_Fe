import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"

export default function AuditLogsPage() {
    return (
        <div className="p-6">
            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Audit Logs</FlatCardTitle>
                    <FlatCardDescription>Track user sign-ins and system changes.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 font-medium">Time</th>
                                    <th className="p-3 font-medium">Activity</th>
                                    <th className="p-3 font-medium">Initiated By</th>
                                    <th className="p-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-3">Oct 24, 2024 10:23 AM</td>
                                    <td className="p-3">User Login</td>
                                    <td className="p-3">admin@example.com</td>
                                    <td className="p-3 text-green-600">Success</td>
                                </tr>
                                <tr>
                                    <td className="p-3">Oct 24, 2024 09:12 AM</td>
                                    <td className="p-3">Update User Role</td>
                                    <td className="p-3">system</td>
                                    <td className="p-3 text-green-600">Success</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
