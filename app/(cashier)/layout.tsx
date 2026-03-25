import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";
import AdminLayout from "@/modules/admin/ui/layout/admin-layout";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayoutWrapper({
  children,
}: AdminLayoutProps) {
  const session = await getSession();
  const isAdmin = session?.user.role === "cashier";

  if (!isAdmin) redirect("/");

  return <AdminLayout>{children}</AdminLayout>;
}
