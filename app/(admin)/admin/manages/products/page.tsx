import PageContainer from "@/components/custom/page-container";
import AddProduct from "@/modules/admin/ui/components/manages/products/buttons/add-product";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products",
    description: "Manage products in this store app",
    robots: { index: false, follow: false },
};

export default function ProductsPage() {
    return (
        <PageContainer
            pageTitle="Products"
            pageDescription="Manage products and variants in this store app"
            pageHeaderAction={<AddProduct />}
        >
            <h1>Products Page</h1>
        </PageContainer>
    );
}
