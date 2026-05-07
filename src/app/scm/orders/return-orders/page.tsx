import { redirect } from "next/navigation"

export default function OrdersReturnRedirect() {
    redirect("/scm/returns/customer-returns")
}
