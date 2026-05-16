import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default async function AdminLayoutWrapper({ children }: AdminLayoutProps) {
    const session = await getSession();
    const isAdmin = session?.user.role === "superadmin";

    if (!isAdmin) redirect("/admin/dashboard");

    return <>{children}</>;
}
