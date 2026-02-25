import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReviewCard {
  name: string;
  rating: number;
  review: string;
}

const reviews: ReviewCard[] = [
  { name: "Rahul Mehta", rating: 5, review: "The tap finish is absolutely premium. Worth every rupee." },
  { name: "Priya Sharma", rating: 5, review: "Elegant design that transformed our bathroom completely." },
  { name: "Anil Kapoor", rating: 4, review: "Solid build quality. The matte black finish is stunning." },
  { name: "Sneha Reddy", rating: 5, review: "Best sanitary ware we've purchased. Truly luxurious." },
  { name: "Vikram Joshi", rating: 5, review: "Exceptional craftsmanship. Guests always compliment our washbasin." },
  { name: "Meera Patel", rating: 4, review: "Sleek, modern, and durable. Exactly what we wanted." },
  { name: "Arjun Nair", rating: 5, review: "Premium quality that you can feel the moment you touch it." },
  { name: "Kavita Singh", rating: 5, review: "Beautiful shower set. The rain effect is heavenly." },
  { name: "Rohan Desai", rating: 4, review: "Clean lines, perfect finish. Very happy with our choice." },
  { name: "Ananya Gupta", rating: 5, review: "Five-star experience from browsing to installation." },
];

interface FloatingCardProps {
  review: ReviewCard;
  x: number;
  duration: number;
  delay: number;
}

const FloatingCard = ({ review, x, duration, delay }: FloatingCardProps) => {
  return (
    <motion.div
      className="absolute rounded-xl border border-warm-white/[0.08] bg-warm-white/[0.06] backdrop-blur-[2px] shadow-subtle px-4 py-3 w-56 pointer-events-none opacity-[0.18]"
      style={{ left: `${x}%` }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{ y: "-120vh", opacity: 1 }}
      transition={{
        y: {
          duration,
          repeat: Infinity,
          ease: "linear",
          delay,
        },
        opacity: {
          duration: 2,
          delay,
        },
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs font-body font-medium text-warm-white/60">
          {review.name}
        </span>
      </div>
      <div className="flex gap-0.5 mb-1.5">
        {Array.from({ length: review.rating }, (_, i) => (
          <Star
            key={i}
            className="h-2.5 w-2.5 fill-accent/50 text-accent/50"
          />
        ))}
      </div>
      <p className="text-[11px] font-body text-warm-white/40 leading-relaxed">
        "{review.review}"
      </p>
    </motion.div>
  );
};

const FloatingReviewCards = () => {
  const isMobile = useIsMobile();

  const cardCount = isMobile ? 4 : 8;
  const selectedReviews = reviews.slice(0, cardCount);

  const cardConfigs = selectedReviews.map((review, i) => ({
    review,
    x: 5 + ((i * 37) % 70) + (i % 3) * 8,
    duration: isMobile ? 35 + i * 5 : 25 + i * 4,
    delay: i * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fade masks: top and bottom */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {cardConfigs.map((config, i) => (
          <FloatingCard key={i} {...config} />
        ))}
      </div>
    </div>
  );
};

export default FloatingReviewCards;
