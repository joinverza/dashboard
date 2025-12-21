import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockData } from "@/contexts/MockDataContext";

export default function ProductsSection() {
  const { productCards } = useMockData();
  const isLoading = false;
  const error = false;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Failed to load products
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-4"
    >
      {productCards?.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
}
