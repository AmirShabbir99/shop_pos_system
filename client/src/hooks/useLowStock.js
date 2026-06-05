import { useGetProductsQuery } from "../features/product/productApi";

export const useLowStock = () => {
  const { data } = useGetProductsQuery({ limit: 100, status: "active" });

  const lowStockProducts = data?.products?.filter(
    (p) => p.stock <= p.lowStockAlert && p.stock > 0
  ) || [];

  const outOfStock = data?.products?.filter(
    (p) => p.stock === 0
  ) || [];

  return {
    lowStockCount: lowStockProducts.length + outOfStock.length,
    lowStockProducts,
    outOfStock,
  };
};