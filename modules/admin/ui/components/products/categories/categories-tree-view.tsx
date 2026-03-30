"use client";
import { appToast } from "@/components/custom/app-toast";
import { TreeView, TreeDataItem } from "@/components/custom/tree-view";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, PackageOpen, File } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildTree(data: any[]) {
  const map = new Map<string, any>();
  const roots: TreeDataItem[] = [];

  // buat map tanpa children dulu
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

export function CategoriesTreeView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const dragItemMutation = useMutation(trpc.category.editParentId.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.category.get.queryOptions());
      appToast.success("Category moved successfully!");
    },
    onError: (error) => {
      appToast.error(error.message);
      console.error(error);
    },
  }));
  const handleDrag = ({sourceId, targetId} : {sourceId: string, targetId: string})=>{
    dragItemMutation.mutate({
      id: sourceId,
      parentId: targetId,
    });
  }
  const { data: categories, isLoading } = useQuery(
    trpc.category.get.queryOptions(),
  );
  const tree = buildTree(categories || []);
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Spinner />
      <p>Getting categories data...</p>
    </div>
  ) : tree.length > 0 ? (
    <TreeView
      onDocumentDrag={(source, target) => {
        if(source.parentId === target.id || target.parentId === source.id){
          appToast.error("Cannot move category to itself!");
          return;
        }
        if(target.categoryIndex + 1 === 5){
          appToast.error("Cannot move category to more than 5 levels!");
          return;
        }
        handleDrag({sourceId: source.id, targetId: target.id});
      }}
      defaultNodeIcon={Box}
      defaultLeafIcon={File}
      defaultNodeOpenIcon={PackageOpen}
      data={tree}
    />
  ) : (
    <div className=" text-muted-foreground">
      <p>No categories found</p>
    </div>
  );
}
