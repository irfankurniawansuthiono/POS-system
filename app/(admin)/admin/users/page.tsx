import PageContainer from "@/components/custom/page-container";
import AddUsers from "@/modules/admin/ui/components/users/button/AddUsers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return (
    <PageContainer
      pageTitle="Users"
      pageDescription="Manage user accounts here"
      pageHeaderAction={<AddUsers/>}
    >
      Users
    </PageContainer>
  );
}
