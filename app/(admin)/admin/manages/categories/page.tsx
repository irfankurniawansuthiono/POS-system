import PageContainer from "@/components/custom/page-container";
import AddCategories from "@/modules/admin/ui/components/manages/categories/button/add-category";
import { CategoriesTreeView } from "@/modules/admin/ui/components/manages/categories/categories-tree-view";
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
      pageDescription="Manage product's categories"
      pageHeaderAction={<AddCategories />}
    >
      <CategoriesTreeView />
    </PageContainer>
  );
}
