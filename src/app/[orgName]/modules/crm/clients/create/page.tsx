"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CreateClientRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const orgName = params.orgName as string;

  useEffect(() => {
    router.replace(`/${orgName}/modules/settings/entitlements/clients/add`);
  }, [orgName, router]);

  return (
    <div className="p-8 text-sm text-zinc-500">
      Redirecting to the client onboarding wizard…
    </div>
  );
}
