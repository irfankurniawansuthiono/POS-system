import PageContainer from "@/components/custom/page-container";
import AddSupplier from "@/modules/admin/ui/components/manages/suppliers/button/add-supplier";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "Manage suppliers for products in this store app",
  robots: { index: false, follow: false },
};

export default function SuppliersPage() {
  return (
    <PageContainer
      pageTitle="Suppliers"
      pageDescription="Manage product's suppliers in this store app"
      pageHeaderAction={<AddSupplier/>}
    >
      <h1>Suppliers Page</h1>
        {/* <BransDataTable/> */}
    </PageContainer>
  );
}
