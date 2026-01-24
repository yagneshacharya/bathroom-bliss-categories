import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";

// Import category images
import washBasinsImg from "@/assets/categories/wash-basins.jpg";
import waterClosetsImg from "@/assets/categories/water-closets.jpg";
import bathroomCabinetsImg from "@/assets/categories/bathroom-cabinets.jpg";
import tapsFaucetsImg from "@/assets/categories/taps-faucets.jpg";
import showersImg from "@/assets/categories/showers.jpg";
import kitchenSinksImg from "@/assets/categories/kitchen-sinks.jpg";
import urinalsImg from "@/assets/categories/urinals.jpg";
import bathroomAccessoriesImg from "@/assets/categories/bathroom-accessories.jpg";

const categories = [
  {
    name: "Wash Basins",
    image: washBasinsImg,
    href: "/category/wash-basins",
  },
  {
    name: "Water Closets",
    image: waterClosetsImg,
    href: "/category/water-closets",
  },
  {
    name: "Cabinets & Vanities",
    image: bathroomCabinetsImg,
    href: "/category/bathroom-cabinets",
  },
  {
    name: "Taps & Faucets",
    image: tapsFaucetsImg,
    href: "/category/taps-faucets",
  },
  {
    name: "Showers & Accessories",
    image: showersImg,
    href: "/category/showers",
  },
  {
    name: "Kitchen Sinks",
    image: kitchenSinksImg,
    href: "/category/kitchen-sinks",
  },
  {
    name: "Urinals",
    image: urinalsImg,
    href: "/category/urinals",
  },
  {
    name: "Bathroom Accessories",
    image: bathroomAccessoriesImg,
    href: "/category/bathroom-accessories",
  },
];

const CategoriesSection = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <span className="mb-3 inline-block font-body text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Our Collection
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto max-w-2xl font-body text-base text-muted-foreground md:text-lg">
            Discover premium sanitary ware and bathroom accessories designed for modern living
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
              href={category.href}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center md:mt-16"
        >
          <p className="font-body text-sm text-muted-foreground">
            Can't find what you're looking for?{" "}
            <a
              href="/contact"
              className="font-medium text-accent underline-offset-4 transition-colors hover:underline"
            >
              Contact our experts
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
