import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Settings,
  LayoutGrid,
  Users,
  ShoppingBag,
  CreditCard,
  Bell,
  ChevronLeft,
  FolderTree,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Category } from "@/types/category";
import { initialCategories } from "@/data/mockCategories";
import CategoryTreeItem from "@/components/admin/CategoryTreeItem";
import CategoryModal from "@/components/admin/CategoryModal";

// Sidebar nav items
const sidebarItems = [
  { icon: LayoutGrid, label: "General", active: false },
  { icon: FolderTree, label: "Categories", active: true },
  { icon: ShoppingBag, label: "Products", active: false },
  { icon: Users, label: "Users", active: false },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: Bell, label: "Notifications", active: false },
];

// Helper: generate unique id
let idCounter = 100;
const generateId = () => `cat-${++idCounter}`;

// Helper: find matching categories and their ancestor paths
const findMatches = (categories: Category[], query: string): { matches: Set<string>; expanded: Set<string> } => {
  const matches = new Set<string>();
  const expanded = new Set<string>();
  const q = query.toLowerCase();

  const walk = (cats: Category[], ancestors: string[]): boolean => {
    let anyMatch = false;
    for (const cat of cats) {
      const nameMatch = cat.name.toLowerCase().includes(q);
      const childMatch = walk(cat.children, [...ancestors, cat.id]);
      if (nameMatch || childMatch) {
        if (nameMatch) matches.add(cat.id);
        if (childMatch) expanded.add(cat.id);
        ancestors.forEach((a) => expanded.add(a));
        anyMatch = true;
      }
    }
    return anyMatch;
  };

  walk(categories, []);
  return { matches, expanded };
};

// Deep helpers for immutable tree ops
const addChild = (cats: Category[], parentId: string, child: Category): Category[] =>
  cats.map((c) =>
    c.id === parentId
      ? { ...c, children: [...c.children, child] }
      : { ...c, children: addChild(c.children, parentId, child) }
  );

const updateCategory = (cats: Category[], id: string, data: Partial<Category>): Category[] =>
  cats.map((c) =>
    c.id === id
      ? { ...c, ...data }
      : { ...c, children: updateCategory(c.children, id, data) }
  );

const deleteCategory = (cats: Category[], id: string): Category[] =>
  cats.filter((c) => c.id !== id).map((c) => ({ ...c, children: deleteCategory(c.children, id) }));

const hasChildren = (cats: Category[], id: string): boolean => {
  for (const c of cats) {
    if (c.id === id) return c.children.length > 0;
    if (hasChildren(c.children, id)) return true;
  }
  return false;
};

const disableRecursive = (cats: Category[], id: string): Category[] =>
  cats.map((c) =>
    c.id === id
      ? { ...c, status: "disabled" as const, children: c.children.map((ch) => disableAll(ch)) }
      : { ...c, children: disableRecursive(c.children, id) }
  );

const disableAll = (cat: Category): Category => ({
  ...cat,
  status: "disabled",
  children: cat.children.map(disableAll),
});

const AdminSettings = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [parentForNew, setParentForNew] = useState<{ id: string; name: string } | null>(null);

  // Confirm dialog state
  const [confirmDisable, setConfirmDisable] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Search logic
  const { matches: searchMatches, expanded: searchExpanded } = useMemo(
    () => (search.trim() ? findMatches(categories, search) : { matches: new Set<string>(), expanded: new Set<string>() }),
    [search, categories]
  );

  // Handlers
  const handleAddRoot = () => {
    setEditCategory(null);
    setParentForNew(null);
    setModalOpen(true);
  };

  const handleAddSubcategory = (parentId: string, parentName: string) => {
    setEditCategory(null);
    setParentForNew({ id: parentId, name: parentName });
    setModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditCategory(cat);
    setParentForNew(null);
    setModalOpen(true);
  };

  const handleToggleStatus = useCallback(
    (id: string) => {
      // Check current status
      const findCat = (cats: Category[]): Category | undefined => {
        for (const c of cats) {
          if (c.id === id) return c;
          const found = findCat(c.children);
          if (found) return found;
        }
      };
      const cat = findCat(categories);
      if (!cat) return;

      if (cat.status === "disabled") {
        // Enable
        setCategories((prev) => updateCategory(prev, id, { status: "active" }));
      } else {
        // Check if has children → confirm
        if (cat.children.length > 0) {
          setConfirmDisable(id);
        } else {
          setCategories((prev) => updateCategory(prev, id, { status: "disabled" }));
        }
      }
    },
    [categories]
  );

  const handleConfirmDisable = () => {
    if (confirmDisable) {
      setCategories((prev) => disableRecursive(prev, confirmDisable));
      setConfirmDisable(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setCategories((prev) => deleteCategory(prev, deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSave = (data: { name: string; slug: string; status: "active" | "disabled" }) => {
    if (editCategory) {
      setCategories((prev) => updateCategory(prev, editCategory.id, data));
    } else if (parentForNew) {
      const newCat: Category = { id: generateId(), ...data, productCount: 0, children: [] };
      setCategories((prev) => addChild(prev, parentForNew.id, newCat));
    } else {
      const newCat: Category = { id: generateId(), ...data, productCount: 0, children: [] };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col shrink-0">
        <div className="p-5 border-b">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </button>
          <h2 className="font-display text-lg mt-3 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </h2>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">Categories</h1>
              <p className="text-sm text-muted-foreground mt-1 font-body">
                Manage your product categories with unlimited nesting.
              </p>
            </div>
            <Button onClick={handleAddRoot} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Root Category
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tree */}
          <div className="border rounded-xl bg-card shadow-subtle p-2">
            {categories.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FolderTree className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-body text-sm">No categories yet. Add your first root category to get started.</p>
              </div>
            ) : (
              categories.map((cat) => (
                <CategoryTreeItem
                  key={cat.id}
                  category={cat}
                  depth={0}
                  onAddSubcategory={handleAddSubcategory}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  searchMatch={searchMatches}
                  expandedBySearch={searchExpanded}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Category Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editCategory={editCategory}
        parentName={parentForNew?.name}
      />

      {/* Disable Confirmation */}
      <AlertDialog open={!!confirmDisable} onOpenChange={(v) => !v && setConfirmDisable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Disabling this category will also disable all subcategories. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDisable}>Disable All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this category and all its subcategories. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettings;
