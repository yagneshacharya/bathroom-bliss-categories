import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductOptions from "@/components/product/ProductOptions";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

// Mock product data
const mockProduct = {
  id: "premium-wash-basin-01",
  name: "Elegance Premium Wall-Mounted Wash Basin",
  category: "Wash Basins",
  categorySlug: "wash-basins",
  price: 12499,
  originalPrice: 15999,
  description: "Elevate your bathroom aesthetics with our Elegance Premium Wash Basin. Crafted from high-grade vitreous china, this wall-mounted basin features clean lines and a contemporary design that complements any modern bathroom décor.",
  images: [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=800&fit=crop",
  ],
  colors: [
    { name: "White Glossy", value: "white-glossy", hex: "#FFFFFF" },
    { name: "Matte Black", value: "matte-black", hex: "#1A1A1A" },
    { name: "Brushed Gold", value: "brushed-gold", hex: "#B8860B" },
    { name: "Chrome Silver", value: "chrome-silver", hex: "#C0C0C0" },
    { name: "Ivory", value: "ivory", hex: "#FFFFF0" },
  ],
  sizes: [
    { name: "Standard", value: "standard", dimensions: "450 x 350 x 150 mm" },
    { name: "Medium", value: "medium", dimensions: "550 x 400 x 160 mm" },
    { name: "Large", value: "large", dimensions: "650 x 450 x 170 mm" },
    { name: "Extra Large", value: "xl", dimensions: "750 x 500 x 180 mm" },
  ],
  materials: [
    { name: "Vitreous China", value: "vitreous-china" },
    { name: "Ceramic", value: "ceramic" },
    { name: "Solid Surface", value: "solid-surface" },
  ],
  specifications: [
    { label: "Brand", value: "SanitaryPro" },
    { label: "Model Number", value: "SP-WB-2024" },
    { label: "Installation Type", value: "Wall Mounted" },
    { label: "Basin Shape", value: "Rectangular" },
    { label: "Faucet Holes", value: "Single Hole" },
    { label: "Overflow", value: "Yes" },
    { label: "Weight", value: "12 kg" },
    { label: "Warranty", value: "10 Years" },
    { label: "Country of Origin", value: "India" },
  ],
  reviews: [
    {
      id: "1",
      author: "Rajesh Kumar",
      rating: 5,
      date: "15 Jan 2024",
      comment: "Excellent quality wash basin. The finish is premium and installation was straightforward. Highly recommended for modern bathrooms.",
      helpful: 24,
    },
    {
      id: "2",
      author: "Priya Sharma",
      rating: 4,
      date: "10 Jan 2024",
      comment: "Beautiful design and good quality. Only giving 4 stars because delivery took longer than expected.",
      helpful: 12,
    },
    {
      id: "3",
      author: "Amit Patel",
      rating: 5,
      date: "5 Jan 2024",
      comment: "Perfect for our bathroom renovation. The matte black finish looks stunning and matches our theme perfectly.",
      helpful: 18,
    },
  ],
  averageRating: 4.7,
  totalReviews: 156,
  ratingDistribution: [
    { stars: 5, count: 98 },
    { stars: 4, count: 38 },
    { stars: 3, count: 12 },
    { stars: 2, count: 5 },
    { stars: 1, count: 3 },
  ],
  relatedProducts: [
    {
      id: "tap-modern-01",
      name: "Modern Single Lever Basin Mixer",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
      price: 4999,
      originalPrice: 6999,
      rating: 4.5,
      reviewCount: 89,
    },
    {
      id: "cabinet-vanity-01",
      name: "Premium Vanity Cabinet Set",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop",
      price: 24999,
      rating: 4.8,
      reviewCount: 67,
    },
    {
      id: "mirror-led-01",
      name: "LED Backlit Bathroom Mirror",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      price: 8999,
      originalPrice: 11999,
      rating: 4.6,
      reviewCount: 124,
    },
    {
      id: "towel-rack-01",
      name: "Stainless Steel Towel Rack",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
      price: 2499,
      rating: 4.3,
      reviewCount: 45,
    },
  ],
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].value);
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes[0].value);
  const [selectedMaterial, setSelectedMaterial] = useState(mockProduct.materials[0].value);
  const [quantity, setQuantity] = useState(1);

  const discount = mockProduct.originalPrice
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-accent">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={`/category/${mockProduct.categorySlug}`}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {mockProduct.category}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  {mockProduct.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Product Section */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImageGallery
              images={mockProduct.images}
              productName={mockProduct.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                {mockProduct.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-foreground">
                  ₹{mockProduct.price.toLocaleString()}
                </span>
                {mockProduct.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{mockProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {mockProduct.description}
              </p>
            </div>

            {/* Product Options */}
            <ProductOptions
              colors={mockProduct.colors}
              sizes={mockProduct.sizes}
              materials={mockProduct.materials}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedMaterial={selectedMaterial}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
              onMaterialChange={setSelectedMaterial}
            />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1 gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="px-4">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-4">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4 bg-muted/30">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-6 w-6 text-accent" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-6 w-6 text-accent" />
                <span className="text-xs text-muted-foreground">10 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw className="h-6 w-6 text-accent" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent"
              >
                Reviews ({mockProduct.totalReviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-8">
              <ProductSpecifications specifications={mockProduct.specifications} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <ProductReviews
                reviews={mockProduct.reviews}
                averageRating={mockProduct.averageRating}
                totalReviews={mockProduct.totalReviews}
                ratingDistribution={mockProduct.ratingDistribution}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <RelatedProducts products={mockProduct.relatedProducts} />
        </motion.div>
      </div>
    </main>
  );
};

export default ProductDetail;
