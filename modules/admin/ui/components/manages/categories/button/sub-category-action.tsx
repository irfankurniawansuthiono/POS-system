import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import AddSubCategories from "./add-sub-category";
import { useState } from "react";
import DeleteSubCategory from "./delete-sub-category";
import UpdateCurrentCategory from "./update-current-category";

export default function SubCategoryAction({ level, parentId, parentName, isLastLevel }: { level: number, parentId: string, parentName: string, isLastLevel: boolean }) {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
            <Ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {level < 4 && <DropdownMenuItem onClick={(e)=> {e.stopPropagation(); setOpenAddSubCategory(true)}}>
                Add Sub Category
              </DropdownMenuItem>}
            <DropdownMenuItem onClick={()=> setOpenEditSubCategory(true)}>Update</DropdownMenuItem>
            {isLastLevel && <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)} className="text-destructive">Delete</DropdownMenuItem>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Add New Sub Category */}
      <AddSubCategories open={openAddSubCategory} setDialogOpen={setOpenAddSubCategory} parentId={parentId}  parentName={parentName} level={level}/>
      {/* Edit Sub Category */}
      <UpdateCurrentCategory open={openEditSubCategory} setDialogOpen={setOpenEditSubCategory} parentId={parentId}  parentName={parentName} level={level}/>
      {/* Delete Sub Category */}
      <DeleteSubCategory  level={level} parentName={parentName}open={openDeleteDialog} setOpen={setOpenDeleteDialog} id={parentId} />
    </>
  );
}
