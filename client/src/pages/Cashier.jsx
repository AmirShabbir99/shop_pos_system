import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  ScanLine,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  ReceiptText,
  Package,
  Users,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Clock3,
} from "lucide-react";

const sampleProducts = [
  { id: 1, name: "Milk 1L", sku: "PRD-001", price: 220, stock: 24, category: "Dairy" },
  { id: 2, name: "Bread", sku: "PRD-002", price: 120, stock: 18, category: "Bakery" },
  { id: 3, name: "Eggs (12)", sku: "PRD-003", price: 350, stock: 12, category: "Dairy" },
  { id: 4, name: "Rice 5kg", sku: "PRD-004", price: 1850, stock: 9, category: "Grocery" },
  { id: 5, name: "Soap Bar", sku: "PRD-005", price: 95, stock: 40, category: "Home" },
  { id: 6, name: "Tea 250g", sku: "PRD-006", price: 480, stock: 15, category: "Beverage" },
];

const recentSales = [
  { invoice: "INV-1042", customer: "Walk-in", total: 1240, time: "2 min ago" },
  { invoice: "INV-1041", customer: "Ali Khan", total: 860, time: "7 min ago" },
  { invoice: "INV-1040", customer: "Walk-in", total: 2100, time: "19 min ago" },
];

const categories = ["All", "Grocery", "Dairy", "Bakery", "Beverage", "Home"];

const money = (value) => `Rs ${value.toLocaleString()}`;

export default function CashierDashboardModern() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([
    { ...sampleProducts[0], qty: 2 },
    { ...sampleProducts[2], qty: 1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");

  const filteredProducts = useMemo(() => {
    return sampleProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const discount = 0;
  const total = subtotal + tax - discount;

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    // connect this with your backend sale API later
    alert(`Checkout done: ${money(total)} via ${paymentMethod}`);
    setCart([]);
    setCustomerName("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg shadow-slate-200">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">POS System</h1>
            <p className="text-xs text-slate-500">Cashier Dashboard</p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {[
              [ScanLine, "POS Counter", true],
              [Package, "Products"],
              [ReceiptText, "Sales History"],
              [Wallet, "Cash Summary"],
              [BarChart3, "Reports"],
              [Users, "Customers"],
            ].map(([Icon, label, active]) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-3xl bg-slate-900 p-4 text-white">
            <p className="text-xs text-slate-300">Shift Status</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Open</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Cashier Workspace
              </p>
              <h2 className="text-xl font-bold sm:text-2xl">Welcome back, Amir</h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-50">
                <Bell className="h-5 w-5" />
              </button>
              <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-50">
                <Settings className="h-5 w-5" />
              </button>
              <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 sm:block">
                <p className="text-sm font-semibold">Cashier #102</p>
                <p className="text-xs text-slate-500">Shift 09:00 - 18:00</p>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.6fr_0.95fr] lg:p-8">
          {/* Left content */}
          <section className="space-y-6">
            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Today Sales", value: "Rs 24,500", icon: Wallet, color: "bg-blue-50 text-blue-700" },
                { title: "Orders", value: "152", icon: ReceiptText, color: "bg-emerald-50 text-emerald-700" },
                { title: "Items Sold", value: "328", icon: Package, color: "bg-amber-50 text-amber-700" },
                { title: "Cash in Drawer", value: "Rs 18,200", icon: Banknote, color: "bg-violet-50 text-violet-700" },
              ].map(({ title, value, icon: Icon, color }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -3 }}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{title}</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight">{value}</h3>
                    </div>
                    <div className={`rounded-2xl p-3 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Search + scan */}
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Search className="h-4 w-4" />
                  Search products / SKU
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-900">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Milk, Bread, PRD-001..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-sm font-medium text-slate-600">Quick Scan</p>
                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 font-medium text-white transition hover:bg-slate-800">
                  <ScanLine className="h-5 w-5" />
                  Scan Barcode
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Products</h3>
                  <p className="text-sm text-slate-500">Tap to add items to cart</p>
                </div>
                <p className="text-sm text-slate-500">{filteredProducts.length} items</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(product)}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {product.sku}
                        </p>
                        <h4 className="mt-1 text-base font-semibold">{product.name}</h4>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Price</p>
                        <p className="text-lg font-bold">{money(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Stock</p>
                        <p className={`text-lg font-bold ${product.stock < 10 ? "text-rose-600" : "text-emerald-600"}`}>
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700">
                      <Plus className="h-4 w-4" />
                      Add to cart
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* Right panel */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-bold">Current Cart</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {cart.length} items
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Customer Name
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in customer"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                {cart.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                    <ShoppingCart className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-600">Cart is empty</p>
                    <p className="mt-1 text-xs text-slate-400">Add products from the left panel</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-slate-500">{money(item.price)} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="rounded-xl p-2 transition hover:bg-white"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="rounded-xl p-2 transition hover:bg-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">{money(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Payment</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { id: "cash", label: "Cash", icon: Banknote },
                  { id: "card", label: "Card", icon: CreditCard },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      paymentMethod === id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-4">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Tax (5%)" value={money(tax)} />
                <Row label="Discount" value={money(discount)} />
                <div className="h-px bg-slate-200" />
                <Row label="Total" value={money(total)} strong />
              </div>

              <button
                onClick={handleCheckout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-semibold text-white transition hover:bg-emerald-700"
              >
                <ReceiptText className="h-5 w-5" />
                Checkout
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                F12 shortcut • Print invoice • Save sale to backend
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Sales</h3>
                <Clock3 className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-4 space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.invoice} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">{sale.invoice}</p>
                      <p className="text-xs text-slate-500">{sale.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{money(sale.total)}</p>
                      <p className="text-xs text-slate-500">{sale.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={strong ? "font-bold text-slate-900" : "text-slate-600"}>{label}</span>
      <span className={strong ? "text-lg font-bold text-slate-900" : "font-medium text-slate-900"}>{value}</span>
    </div>
  );
}
