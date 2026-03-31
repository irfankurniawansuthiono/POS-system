"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { highlightText } from "@/lib/highlight-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SubCategoryAction from "@/modules/admin/ui/components/products/categories/button/sub-category-action";
const treeVariants = cva(
  "hover:bg-accent rounded-md group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10",
);

const selectedTreeVariants = cva(
  "before:opacity-100 before:bg-accent/70 text-accent-foreground",
);

const dragOverVariants = cva(
  "before:opacity-100 before:bg-primary/20 text-primary-foreground",
);

interface TreeDataItem {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  selectedIcon?: React.ComponentType<{ className?: string }>;
  openIcon?: React.ComponentType<{ className?: string }>;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
  draggable?: boolean;
  droppable?: boolean;
  disabled?: boolean;
  className?: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoryIndex: number;
  parentId?: string;
}

type TreeRenderItemParams = {
  item: TreeDataItem;
  level: number;
  isLeaf: boolean;
  isSelected: boolean;
  isOpen?: boolean;
  hasChildren: boolean;
};

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  query?: string;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll: boolean;
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  defaultNodeOpenIcon?: React.ComponentType<{ className?: string }>;
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void;
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode;
};

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      query,
      initialSelectedItemId,
      onSelectChange,
      expandAll = false,
      defaultLeafIcon,
      defaultNodeIcon,
      defaultNodeOpenIcon,
      className,
      onDocumentDrag,
      renderItem,
      ...props
    },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId);

    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(
      null,
    );

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange],
    );

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item);
    }, []);

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem) => {
        if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
          onDocumentDrag(draggedItem, targetItem);
        }
        setDraggedItem(null);
      },
      [draggedItem, onDocumentDrag],
    );

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[];
      }

      const ids: string[] = [];

      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string,
      ) {
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i].id);
            if (walkTreeItems(items[i], targetId) && !expandAll) {
              return true;
            }
            if (!expandAll) ids.pop();
          }
        } else if (!expandAll && items.id === targetId) {
          return true;
        } else if (items.children) {
          return walkTreeItems(items.children, targetId);
        }
      }

      walkTreeItems(data, initialSelectedItemId);
      return ids;
    }, [data, expandAll, initialSelectedItemId]);

    return (
      <div className={cn("overflow-hidden relative", className)}>
        <TreeItem
          expandAll={expandAll}
          query={query}
          data={data}
          ref={ref}
          selectedItemId={selectedItemId}
          handleSelectChange={handleSelectChange}
          expandedItemIds={expandedItemIds}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeOpenIcon={defaultNodeOpenIcon}
          defaultNodeIcon={defaultNodeIcon}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          draggedItem={draggedItem}
          renderItem={renderItem}
          level={0}
          {...props}
        />
        <div
          className="w-full h-12"
          onDrop={() => {
            handleDrop({ id: "", name: "parent_div", categoryIndex: 0 });
          }}
        ></div>
      </div>
    );
  },
);
TreeView.displayName = "TreeView";

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  query?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  handleDragStart?: (item: TreeDataItem) => void;
  handleDrop?: (item: TreeDataItem) => void;
  draggedItem: TreeDataItem | null;
  level?: number;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      query,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      defaultNodeOpenIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      renderItem,
      level,
      onSelectChange,
      expandAll,
      initialSelectedItemId,
      onDocumentDrag,
      ...props
    },
    ref,
  ) => {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TreeNode
                      item={item}
                      query={query}
                      level={level ?? 0}
                      selectedItemId={selectedItemId}
                      expandedItemIds={expandedItemIds}
                      handleSelectChange={handleSelectChange}
                      defaultNodeIcon={defaultNodeIcon}
                      defaultNodeOpenIcon={defaultNodeOpenIcon}
                      defaultLeafIcon={defaultLeafIcon}
                      handleDragStart={handleDragStart}
                      handleDrop={handleDrop}
                      draggedItem={draggedItem}
                      renderItem={renderItem}
                      expandAll={expandAll}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created at : {item.createdAt?.toDateString() || "-"}</p>
                    <p>
                      Last Updated at : {item.updatedAt?.toDateString() || "-"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TreeLeaf
                      item={item}
                      level={level ?? 0}
                      query={query}
                      selectedItemId={selectedItemId}
                      handleSelectChange={handleSelectChange}
                      defaultLeafIcon={defaultLeafIcon}
                      handleDragStart={handleDragStart}
                      handleDrop={handleDrop}
                      draggedItem={draggedItem}
                      renderItem={renderItem}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created at : {item.createdAt?.toDateString() || "-"}</p>
                    <p>
                      Last Updated at : {item.updatedAt?.toDateString() || "-"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
TreeItem.displayName = "TreeItem";

const TreeNode = ({
  item,
  expandAll,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  defaultNodeOpenIcon,
  handleDragStart,
  handleDrop,
  draggedItem,
  renderItem,
  query,
  level = 0,
}: {
  item: TreeDataItem;
  expandAll: boolean;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string;
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  defaultNodeOpenIcon?: React.ComponentType<{ className?: string }>;
  handleDragStart?: (item: TreeDataItem) => void;
  handleDrop?: (item: TreeDataItem) => void;
  draggedItem: TreeDataItem | null;
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode;
  level?: number;
  query?: string;
}) => {
  // const [value, setValue] = React.useState(
  //   expandedItemIds.includes(item.id) ? [item.id] : [],
  // );
  const [value, setValue] = React.useState<string[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const hasChildren = !!item.children?.length;
  const isSelected = selectedItemId === item.id;
  const isOpen = value.includes(item.id);

  // set expanded state value based on expandAll and expandedItemIds or nothing
  React.useEffect(() => {
    if (expandAll) {
      setValue([item.id]);
    } else if (expandedItemIds.includes(item.id)) {
      setValue([item.id]);
    } else {
      setValue([]);
    }
  }, [expandAll, expandedItemIds, item.id]);
  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", item.id);
    handleDragStart?.(item);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleDrop?.(item);
  };

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={(s) => setValue(s)}
    >
      <AccordionPrimitive.Item value={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AccordionTrigger
              isOpen={isOpen}
              className={cn(
                treeVariants(),
                isSelected && selectedTreeVariants(),
                isDragOver && dragOverVariants(),
                item.className,
              )}
              onClick={() => {
                handleSelectChange(item);
                item.onClick?.();
              }}
              draggable={!!item.draggable}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {renderItem ? (
                renderItem({
                  item,
                  level,
                  isLeaf: false,
                  isSelected,
                  isOpen,
                  hasChildren,
                })
              ) : (
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TreeIcon
                      item={item}
                      isSelected={isSelected}
                      isOpen={isOpen}
                      default={isOpen ? defaultNodeOpenIcon : defaultNodeIcon}
                    />
                    <span className="text-sm truncate">
                      {query ? highlightText(item.name, query) : item.name}
                    </span>
                    <TreeActions isSelected={isSelected}>
                      {item.actions}
                    </TreeActions>
                  </div>
                  <SubCategoryAction
                    isLastLevel={!hasChildren}
                    parentId={item.id}
                    level={level}
                    parentName={item.name}
                  />
                </div>
              )}
            </AccordionTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Created at : {item.createdAt?.toDateString() || "-"}</p>
            <p>Last Updated at : {item.updatedAt?.toDateString() || "-"}</p>
          </TooltipContent>
        </Tooltip>
        <AccordionContent className="ml-4 pl-1 border-l">
          <TreeItem
            expandAll={expandAll}
            query={query}
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            defaultNodeOpenIcon={defaultNodeOpenIcon}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            draggedItem={draggedItem}
            renderItem={renderItem}
            level={level + 1}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    level: number;
    query?: string;
    selectedItemId?: string;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    defaultLeafIcon?: React.ComponentType<{ className?: string }>;
    handleDragStart?: (item: TreeDataItem) => void;
    handleDrop?: (item: TreeDataItem) => void;
    draggedItem: TreeDataItem | null;
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode;
  }
>(
  (
    {
      className,
      item,
      query,
      level,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      renderItem,
      ...props
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const isSelected = selectedItemId === item.id;

    const onDragStart = (e: React.DragEvent) => {
      if (!item.draggable || item.disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", item.id);
      handleDragStart?.(item);
    };

    const onDragOver = (e: React.DragEvent) => {
      if (
        item.droppable !== false &&
        !item.disabled &&
        draggedItem &&
        draggedItem.id !== item.id
      ) {
        e.preventDefault();
        setIsDragOver(true);
      }
    };

    const onDragLeave = () => {
      setIsDragOver(false);
    };

    const onDrop = (e: React.DragEvent) => {
      if (item.disabled) return;
      e.preventDefault();
      setIsDragOver(false);
      handleDrop?.(item);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "ml-5 flex text-left items-center py-2 cursor-pointer before:right-1",
          treeVariants(),
          className,
          isSelected && selectedTreeVariants(),
          isDragOver && dragOverVariants(),
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          item.className,
        )}
        onClick={() => {
          if (item.disabled) return;
          handleSelectChange(item);
          item.onClick?.();
        }}
        draggable={!!item.draggable && !item.disabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
      >
        {renderItem ? (
          <>
            <div className="h-4 w-4 shrink-0 mr-1" />
            {renderItem({
              item,
              level,
              isLeaf: true,
              isSelected,
              hasChildren: false,
            })}
          </>
        ) : (
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <TreeIcon
                item={item}
                isSelected={isSelected}
                default={defaultLeafIcon}
              />
              <span className="grow text-sm truncate">
                {query ? highlightText(item.name, query) : item.name}
              </span>
              <TreeActions isSelected={isSelected && !item.disabled}>
                {item.actions}
              </TreeActions>
            </div>
            <SubCategoryAction
              isLastLevel={true}
              parentId={item.id}
              level={level}
              parentName={item.name}
            />
          </div>
        )}
      </div>
    );
  },
);
TreeLeaf.displayName = "TreeLeaf";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isOpen: boolean;
  }
>(({ className, children, isOpen, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 w-full items-center py-2 transition-all group",
        className,
      )}
      {...props}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1",
          isOpen && "rotate-90",
        )}
      />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default?: React.ComponentType<{ className?: string }>;
}) => {
  let Icon: React.ComponentType<{ className?: string }> | undefined =
    defaultIcon;
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon;
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon;
  } else if (item.icon) {
    Icon = item.icon;
  }
  return Icon ? <Icon className="h-4 w-4 shrink-0 mr-2" /> : <></>;
};

const TreeActions = ({
  children,
  isSelected,
}: {
  children: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        isSelected ? "block" : "hidden",
        "absolute right-3 group-hover:block",
      )}
    >
      {children}
    </div>
  );
};

export {
  TreeView,
  type TreeDataItem,
  type TreeRenderItemParams,
  AccordionTrigger,
  AccordionContent,
  TreeLeaf,
  TreeNode,
  TreeItem,
};
