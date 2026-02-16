import { useState } from "react";
import { ChevronRight, MoreHorizontal, Plus, Pencil, ToggleLeft, ToggleRight, Trash2, FolderOpen, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CategoryTreeItemProps {
  category: Category;
  depth: number;
  onAddSubcategory: (parentId: string, parentName: string) => void;
  onEdit: (category: Category) => void;
  onToggleStatus: (categoryId: string) => void;
  onDelete: (categoryId: string, categoryName: string) => void;
  searchMatch: Set<string>;
  expandedBySearch: Set<string>;
}

const CategoryTreeItem = ({
  category,
  depth,
  onAddSubcategory,
  onEdit,
  onToggleStatus,
  onDelete,
  searchMatch,
  expandedBySearch,
}: CategoryTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const hasChildren = category.children.length > 0;
  const isDisabled = category.status === "disabled";
  const isHighlighted = searchMatch.has(category.id);

  const effectiveExpanded = isExpanded || expandedBySearch.has(category.id);

  return (
    <div className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 border-l border-border"
          style={{ left: `${depth * 28 + 12}px` }}
        />
      )}

      {/* Category row */}
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer hover:bg-secondary/80",
          isHighlighted && "bg-accent/10 ring-1 ring-accent/30",
          isDisabled && "opacity-60"
        )}
        style={{ paddingLeft: `${depth * 28 + 12}px` }}
      >
        {/* Expand/collapse */}
        <button
          onClick={() => setIsExpanded(!effectiveExpanded)}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 hover:bg-muted",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              effectiveExpanded && "rotate-90"
            )}
          />
        </button>

        {/* Folder icon */}
        {effectiveExpanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 text-accent shrink-0" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {/* Name & count */}
        <span className={cn("font-medium text-sm flex-1 font-body", isDisabled && "line-through decoration-muted-foreground/40")}>
          {category.name}
          <span className="text-muted-foreground font-normal ml-1.5 text-xs">
            ({category.productCount})
          </span>
        </span>

        {/* Status badge */}
        <Badge
          variant={isDisabled ? "secondary" : "default"}
          className={cn(
            "text-[10px] h-5 px-2 font-body",
            isDisabled
              ? "bg-muted text-muted-foreground"
              : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/10"
          )}
        >
          {isDisabled ? "Disabled" : "Active"}
        </Badge>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onAddSubcategory(category.id, category.name)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onToggleStatus(category.id)}>
              {isDisabled ? (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Enable
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Disable
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(category.id, category.name)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {effectiveExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {category.children.map((child) => (
              <CategoryTreeItem
                key={child.id}
                category={child}
                depth={depth + 1}
                onAddSubcategory={onAddSubcategory}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                searchMatch={searchMatch}
                expandedBySearch={expandedBySearch}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryTreeItem;
