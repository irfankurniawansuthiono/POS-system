import PageContainer from "@/components/custom/page-container";
import AddBrand from "@/modules/admin/ui/components/manages/brands/button/add-brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manage brands in this store app",
  robots: { index: false, follow: false },
};

export default function ProductsPage() {
  return (
    <PageContainer
      pageTitle="Products"
      pageDescription="Manage products and variants in this store app"
      pageHeaderAction={<AddBrand/>}
    >
      <h1>Products Page</h1>
    </PageContainer>
  );
}
