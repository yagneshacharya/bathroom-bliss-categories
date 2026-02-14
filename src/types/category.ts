export interface Category {
  id: string;
  name: string;
  slug: string;
  status: "active" | "disabled";
  productCount: number;
  children: Category[];
}
