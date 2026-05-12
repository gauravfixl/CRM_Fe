"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LegacyAdminAuditRedirect() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";

    useEffect(() => {
        router.replace(`/${orgName}/audit-logs`);
    }, [orgName, router]);

    return null;
}
