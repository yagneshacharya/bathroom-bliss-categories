import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  finish: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Luxury Wall-Mount Basin",
    finish: "Matte Black",
    size: '24" × 18"',
    price: 42999,
    originalPrice: 52999,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Premium Rain Shower System",
    finish: "Brushed Nickel",
    size: '12" Head',
    price: 35499,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Designer Floor-Standing Faucet",
    finish: "Chrome",
    size: "Standard",
    price: 18750,
    originalPrice: 22500,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=300&h=300&fit=crop",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce(
    (sum, item) => sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Continue Shopping</span>
          </Link>
          <h1 className="font-display text-xl font-semibold text-foreground">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground font-body">{items.length} item{items.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8 lg:py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
            <h2 className="font-display text-2xl text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground font-body">Discover our premium collection of sanitary ware.</p>
            <Button asChild className="bg-primary text-primary-foreground mt-2">
              <Link to="/">Browse Collection</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-1">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span className="w-8" />
              </div>
              <Separator />

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="grid grid-cols-[auto_1fr] md:grid-cols-[2fr_1fr_1fr_auto] gap-4 md:gap-4 items-center px-4 py-5">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center col-span-1">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm md:text-base font-semibold text-foreground truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">
                          {item.finish} · {item.size}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-body font-medium text-foreground">{formatPrice(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through font-body">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity - stacks on mobile */}
                    <div className="flex items-center justify-between md:justify-center col-span-2 md:col-span-1 mt-2 md:mt-0">
                      <span className="text-xs text-muted-foreground md:hidden">Quantity</span>
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-body font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="hidden md:block text-right">
                      <span className="font-body font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="hidden md:flex w-8 h-8 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Mobile: total + remove */}
                    <div className="flex items-center justify-between col-span-2 md:hidden mt-1">
                      <span className="text-sm font-body font-semibold text-foreground">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-destructive font-body hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 shadow-card sticky top-24">
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">Order Summary</h2>

                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>You Save</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-primary text-primary-foreground h-12 text-sm font-body font-medium tracking-wide">
                  Proceed to Checkout
                </Button>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-3 font-body">
                    Free shipping on orders above {formatPrice(50000)}
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">
                  {[
                    { icon: Truck, label: "Free Delivery" },
                    { icon: Shield, label: "Secure Pay" },
                    { icon: RotateCcw, label: "Easy Returns" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="text-[10px] text-muted-foreground font-body leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
