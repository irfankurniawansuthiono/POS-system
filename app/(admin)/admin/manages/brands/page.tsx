import PageContainer from "@/components/custom/page-container";
import BransDataTable from "@/modules/admin/ui/components/manages/brands/brand-data-table";
import AddBrand from "@/modules/admin/ui/components/manages/brands/button/add-brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manage brands in this store app",
  robots: { index: false, follow: false },
};

export default function BrandsPage() {
  return (
    <PageContainer
      pageTitle="Brands"
      pageDescription="Manage product's brands in this store app"
      pageHeaderAction={<AddBrand/>}
    >
        <BransDataTable/>
    </PageContainer>
  );
}
