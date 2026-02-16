import { useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, ToggleLeft, ToggleRight, Trash2, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Material } from "@/types/material";
import { initialMaterials } from "@/data/mockMaterials";
import { cn } from "@/lib/utils";

let matIdCounter = 200;
const generateMatId = () => `mat-${++matIdCounter}`;

const MaterialsSection = () => {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  // Modal form state
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const filtered = search.trim()
    ? materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : materials;

  const openAdd = () => {
    setEditMaterial(null);
    setName("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (mat: Material) => {
    setEditMaterial(mat);
    setName(mat.name);
    setIsActive(mat.status === "active");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editMaterial) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === editMaterial.id
            ? { ...m, name: name.trim(), status: isActive ? "active" : "disabled" }
            : m
        )
      );
    } else {
      setMaterials((prev) => [
        ...prev,
        { id: generateMatId(), name: name.trim(), status: isActive ? "active" : "disabled" },
      ]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "disabled" : "active" } : m
      )
    );
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setMaterials((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Materials</h1>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            Manage material types for your products.
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Material
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      <div className="border rounded-xl bg-card shadow-subtle p-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Layers className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-body text-sm">
              {search.trim() ? "No materials match your search." : "No materials yet. Add your first material to get started."}
            </p>
          </div>
        ) : (
          filtered.map((mat) => (
            <div
              key={mat.id}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 hover:bg-secondary/80",
                mat.status === "disabled" && "opacity-60"
              )}
            >
              <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
              <span
                className={cn(
                  "font-medium text-sm flex-1 font-body",
                  mat.status === "disabled" && "line-through decoration-muted-foreground/40"
                )}
              >
                {mat.name}
              </span>

              <Badge
                variant={mat.status === "disabled" ? "secondary" : "default"}
                className={cn(
                  "text-[10px] h-5 px-2 font-body",
                  mat.status === "disabled"
                    ? "bg-muted text-muted-foreground"
                    : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/10"
                )}
              >
                {mat.status === "disabled" ? "Disabled" : "Active"}
              </Badge>

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
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => openEdit(mat)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toggleStatus(mat.id)}>
                    {mat.status === "disabled" ? (
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
                    onClick={() => setDeleteTarget(mat)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editMaterial ? "Edit Material" : "Add Material"}
            </DialogTitle>
            <DialogDescription>
              {editMaterial ? "Update the material details below." : "Create a new material."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="mat-name">Material Name</Label>
              <Input
                id="mat-name"
                placeholder="e.g. Ceramic"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm">Status</Label>
                <p className="text-xs text-muted-foreground">
                  {isActive ? "Material is active" : "Material is hidden"}
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {editMaterial ? "Save Changes" : "Create Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this material. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MaterialsSection;
