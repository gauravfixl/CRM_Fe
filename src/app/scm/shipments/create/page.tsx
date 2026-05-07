import { redirect } from "next/navigation"

export default function CreateShipmentPage() {
    redirect("/scm/shipments/list?action=add")
}
