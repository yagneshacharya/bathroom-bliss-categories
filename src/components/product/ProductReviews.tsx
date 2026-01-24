import { Star, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number }[];
}

const ProductReviews = ({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ProductReviewsProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-accent text-accent"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Customer Reviews
      </h3>

      {/* Rating Summary */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </p>
            <div className="mt-2 flex justify-center">{renderStars(Math.round(averageRating))}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalReviews} reviews
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <span className="w-8 text-sm text-muted-foreground">
                {dist.stars}★
              </span>
              <Progress
                value={(dist.count / totalReviews) * 100}
                className="h-2 flex-1"
              />
              <span className="w-8 text-sm text-muted-foreground">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="py-6 first:pt-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-accent/10 text-accent">
                  {review.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        View All Reviews
      </Button>
    </div>
  );
};

export default ProductReviews;
