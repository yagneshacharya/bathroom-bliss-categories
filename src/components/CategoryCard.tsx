import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  index: number;
}

const CategoryCard = ({ name, image, href, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Link
        to={href}
        className="group block relative overflow-hidden rounded-lg bg-card shadow-card transition-all duration-500 hover:shadow-card-hover"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          
          {/* Gold accent line */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <h3 className="font-display text-xl font-semibold text-primary-foreground md:text-2xl">
              {name}
            </h3>
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/90 text-accent-foreground opacity-0 transition-all duration-300 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
