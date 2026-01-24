import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-foreground">
        You May Also Like
      </h3>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block overflow-hidden rounded-lg bg-card shadow-card transition-all hover:shadow-card-hover"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.originalPrice && (
                      <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-semibold text-foreground">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 bg-background shadow-md" />
        <CarouselNext className="-right-4 bg-background shadow-md" />
      </Carousel>
    </div>
  );
};

export default RelatedProducts;
