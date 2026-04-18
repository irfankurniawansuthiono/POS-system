import type { TreeDataItem } from "@/components/custom/tree-view";

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildCategoriesTree(data: any[]) {
    const map = new Map<string, any>();
    const roots: TreeDataItem[] = [];

    // mapping without children
    data.forEach(item => {
        map.set(item.id, {
            id: item.id,
            name: item.name,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            draggable: true,
            categoryIndex: item.categoryIndex,
            parentId: item.parentId,
        });
    });

    // includes children in children props with array types
    data.forEach(item => {
        const current = map.get(item.id);

        if (item.parentId) {
            const parent = map.get(item.parentId);

            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(current);
            }
        } else {
            roots.push(current);
        }
    });

    return roots;
}

function categoriesFilterTree(data: any[], query: string): any[] {
    if (!query) return data;

    return data
        .map(item => {
            const match = item.name.toLowerCase().includes(query.toLowerCase());

            if (item.children) {
                const filteredChildren = categoriesFilterTree(item.children, query);

                if (filteredChildren.length > 0 || match) {
                    return {
                        ...item,
                        children: filteredChildren,
                    };
                }
            }

            if (match) return item;

            return null;
        })
        .filter(Boolean) as any[];
}

function buildProductCategoriesTree(data: any[]) {
    const map = new Map<string, any>();
    const roots: any[] = [];
    data.forEach(item => {
        map.set(item.id, {
            value: item.id,
            label: item.name,
            parentId: item.parentId,
        });
    });
    data.forEach(item => {
        const current = map.get(item.id);
        if (item.parentId) {
            const parent = map.get(item.parentId);
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(current);
            }
        } else {
            roots.push(current);
        }
    });
    return roots;
}
// function productCategoriesFilterTree(data: any[], query: string): any[] {
//     if (!query) return data;
//     console.log("Filtering product categories with query:", query, "on data:", data);
//     return data
//         .map(item => {
//             const match = item.label.toLowerCase().includes(query.toLowerCase());

//             if (item.children) {
//                 const filteredChildren = productCategoriesFilterTree(item.children, query);

//                 if (filteredChildren.length > 0 || match) {
//                     return {
//                         ...item,
//                         children: filteredChildren,
//                     };
//                 }
//             }

//             if (match) return item;

//             return null;
//         })
//         .filter(Boolean) as any[];
// }
export { buildCategoriesTree, buildProductCategoriesTree, categoriesFilterTree };
