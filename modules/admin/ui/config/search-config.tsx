import { BookUser, Boxes, LayoutDashboard, Ribbon, Users } from "lucide-react";

export type SearchItem = {
    title: string;
    url: string;
    group: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut?: string[];
};

export const searchItems: SearchItem[] = [
    // Pages
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        group: "Pages",
        icon: LayoutDashboard,
        shortcut: ["d", "d"],
    },
    {
        title: "Users",
        url: "/admin//users",
        group: "Pages",
        icon: Users,
        shortcut: ["u", "u"],
    },
    {
        title: "Categories",
        url: "/admin/manages/categories",
        group: "Pages",
        icon: Boxes,
        shortcut: ["c", "c"],
    },
    {
        title: "Brands",
        url: "/admin/manages/brands",
        group: "Pages",
        icon: Ribbon,
        shortcut: ["c", "c"],
    },
    {
        title: "Suppliers",
        url: "/admin/manages/suppliers",
        group: "Pages",
        icon: BookUser,
        shortcut: ["c", "c"],
    },
];
