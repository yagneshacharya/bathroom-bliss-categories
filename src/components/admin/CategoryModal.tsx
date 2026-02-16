import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/types/category";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; slug: string; status: "active" | "disabled" }) => void;
  editCategory?: Category | null;
  parentName?: string | null;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const CategoryModal = ({ open, onClose, onSave, editCategory, parentName }: CategoryModalProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setSlug(editCategory.slug);
      setIsActive(editCategory.status === "active");
      setSlugManuallyEdited(true);
    } else {
      setName("");
      setSlug("");
      setIsActive(true);
      setSlugManuallyEdited(false);
    }
  }, [editCategory, open]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      slug: slug || slugify(name),
      status: isActive ? "active" : "disabled",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editCategory ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {editCategory
              ? "Update the category details below."
              : parentName
              ? `Adding subcategory under "${parentName}".`
              : "Create a new root category."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {parentName && !editCategory && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Parent Category</Label>
              <Input value={parentName} disabled className="bg-muted" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Bathroom Accessories"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              placeholder="auto-generated-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
            />
            <p className="text-[11px] text-muted-foreground">Auto-generated from name. Edit if needed.</p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">Status</Label>
              <p className="text-xs text-muted-foreground">{isActive ? "Category is visible" : "Category is hidden"}</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {editCategory ? "Save Changes" : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
