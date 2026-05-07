import { redirect } from "next/navigation"

export default function VendorCreatePage() {
    redirect("/scm/vendors/list?action=add")
}
