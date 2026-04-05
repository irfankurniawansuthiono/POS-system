"use client";
import { appToast } from "@/components/custom/app-toast";
import { TreeView, TreeDataItem } from "@/components/custom/tree-view";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, PackageOpen, File } from "lucide-react";
import SearchCategories from "./input/search-categories";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import AlertCategoryMovedByDragging from "./alert/category-moved-alert";

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildTree(data: any[]) {
  const map = new Map<string, any>();
  const roots: TreeDataItem[] = [];

  // mapping without children
  data.forEach((item) => {
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
  data.forEach((item) => {
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

function filterTree(data: any[], query: string): any[] {
  if (!query) return data;

  return data
    .map((item) => {
      const match = item.name.toLowerCase().includes(query.toLowerCase());

      if (item.children) {
        const filteredChildren = filterTree(item.children, query);

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

export function CategoriesTreeView() {
  const [query, setQuery] = useState<string>("");
  const queryBound = useDebounce(query, 500);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);
  const [dragItems, setDragItems] = useState<{ source: TreeDataItem; target: TreeDataItem } | undefined>();
  const dragItemMutation = useMutation(
    trpc.category.editParentId.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.category.get.queryFilter());
        appToast.success("Category moved successfully!");
      },
      onError: (error) => {
        appToast.error(error.message);
        console.error(error);
      },
    }),
  );
  const handleDrag = ({
    sourceId,
    targetId,
  }: {
    sourceId: string;
    targetId: string;
  }) => {
   setAlertOpen(true);
  };
  const { data, isLoading } = useQuery(trpc.category.get.queryOptions());
  
  // build tree data from flattened array from database
  const buildedTree = buildTree(data || []);

  // filter data with searching query
  const filteredData = useMemo(() => {
    const result = filterTree(buildedTree || [], queryBound);
    return result;
  }, [queryBound, buildedTree]);

  return isLoading ? (
    <div className="flex items-center gap-2">
      <Spinner />
      <p>Getting categories data...</p>
    </div>
  ) : filteredData.length > 0 ? (
    <div className="flex flex-col gap-2">
      <SearchCategories
        setQuery={setQuery}
        isLoading={isLoading || filteredData.length === 0}
      />
      <TreeView
        expandAll={query ? true : false}
        query={query}
        onDocumentDrag={(source, target) => {
          setDragItems({ source, target });
          if (source.parentId === target.id || target.parentId === source.id) {
            appToast.error("Cannot move category to itself!");
            return;
          }
          if (target.categoryIndex + 1 === 5) {
            appToast.error("Cannot move category to more than 5 levels!");
            return;
          }
          handleDrag({ sourceId: source.id, targetId: target.id });
        }}
        defaultNodeIcon={Box}
        defaultLeafIcon={File}
        defaultNodeOpenIcon={PackageOpen}
        data={filteredData}
      />
      <AlertCategoryMovedByDragging
        sourceName={dragItems?.source.name || ""}
        targetName={dragItems?.target.name || ""}
        open={alertOpen}
        action={() => {
          if (dragItems?.source.id && dragItems?.target.id) {
            dragItemMutation.mutate({
              id: dragItems.source.id,
              parentId: dragItems.target.id,
            });
            setAlertOpen(false);
            setDragItems(undefined);
          }
        }}
        setDialogOpen={setAlertOpen}
      />
    </div>
  ) : (
    <div className=" text-muted-foreground flex flex-col gap-2">
      <SearchCategories
        setQuery={setQuery}
        isLoading={isLoading || data!.length === 0}
      />
      <p>No categories found</p>
    </div>
  );
}
