import PageContainer from "@/components/custom/page-container";
import AddCategories from "@/modules/admin/ui/components/products/categories/button/add-category";
import { CategoriesTreeView } from "@/modules/admin/ui/components/products/categories/categories-tree-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your product categories",
  robots: { index: false, follow: false },
};

export default function CategoriesPage() {
  return (
    <PageContainer
      pageTitle="Categories"
      pageDescription="Manage your product categories"
      pageHeaderAction={<AddCategories />}
    >
      <CategoriesTreeView />
    </PageContainer>
  );
}
