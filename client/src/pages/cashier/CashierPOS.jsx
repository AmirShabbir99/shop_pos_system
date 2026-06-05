import { useState, useEffect, useRef, useCallback } from "react";
import { useGetProductsQuery } from "../../features/product/productApi";
import { useGetCategoriesQuery } from "../../features/category/categoryApi";
import { useCreateSaleMutation } from "../../features/sale/saleApi";
import {
  Search, ShoppingCart, Trash2, Plus, Minus,
  X, Loader2, Package, CheckCircle,
  Banknote, CreditCard, Smartphone, SplitSquareHorizontal,
  Tag, RotateCcw, ChevronLeft, ChevronRight,
} from "lucide-react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner";
import ReceiptModal from "../../components/receipt/ReceiptModal";

// ── Constants ──────────────────────────────────────────────
const PAY_METHODS = [
  { id: "cash",      label: "Cash",      icon: Banknote             },
  { id: "card",      label: "Card",      icon: CreditCard           },
  { id: "jazzcash",  label: "JazzCash",  icon: Smartphone           },
  { id: "easypaisa", label: "Easypaisa", icon: Smartphone           },
  { id: "split",     label: "Split",     icon: SplitSquareHorizontal},
];

const COUPONS = {
  SAVE10:  { type: "percent", value: 10  },
  FLAT50:  { type: "flat",    value: 50  },
  FLAT100: { type: "flat",    value: 100 },
  VIP20:   { type: "percent", value: 20  },
};

const TAX_RATE = 0.05;

// ── Product Card ───────────────────────────────────────────
const PosProductCard = ({ product, onAdd }) => {
  const outOfStock = product.stock === 0;
  return (
    <button
      onClick={() => !outOfStock && onAdd(product)}
      disabled={outOfStock}
      className={`relative bg-white rounded-2xl border transition-all duration-150 text-left overflow-hidden
        ${outOfStock
          ? "opacity-50 cursor-not-allowed border-gray-100"
          : "border-gray-100 hover:border-indigo-400 hover:shadow-md active:scale-95 cursor-pointer"
        }`}
    >
      {product.image?.url ? (
        <img src={product.image.url} alt={product.name} className="w-full h-24 object-cover" />
      ) : (
        <div className="w-full h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
          <Package size={28} className="text-indigo-300" />
        </div>
      )}
      {outOfStock && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            Out of Stock
          </span>
        </div>
      )}
      <div className="p-2.5">
        <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
        <p className="text-xs text-gray-400 truncate">{product.category?.name}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-indigo-600">Rs. {product.salePrice}</span>
          <span className="text-xs text-gray-400">{product.stock} left</span>
        </div>
      </div>
    </button>
  );
};

// ── Cart Item ──────────────────────────────────────────────
const CartItem = ({ item, onInc, onDec, onRemove }) => (
  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5 group">
    {item.image ? (
      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
    ) : (
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Package size={16} className="text-indigo-400" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
      <p className="text-xs text-indigo-600 font-medium">Rs. {item.salePrice} each</p>
    </div>
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button onClick={() => onDec(item.productId)}
        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition">
        <Minus size={11} />
      </button>
      <span className="w-7 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
      <button onClick={() => onInc(item.productId)}
        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition">
        <Plus size={11} />
      </button>
      <button onClick={() => onRemove(item.productId)}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 transition ml-1">
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ── Scan Flash Toast ───────────────────────────────────────
const ScanToast = ({ show, found, productName }) => {
  if (!show) return null;
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all
      ${found ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
      {found
        ? <><CheckCircle size={15} /> {productName} added to cart!</>
        : <><X size={15} /> Product not found!</>
      }
    </div>
  );
};

// ── Main CashierPOS ────────────────────────────────────────
const CashierPOS = () => {
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("");
  const [page,         setPage]         = useState(1);
  const [cart,         setCart]         = useState([]);
  const [couponCode,   setCouponCode]   = useState("");
  const [appliedCoupon,setAppliedCoupon]= useState(null);
  const [payMethod,    setPayMethod]    = useState("cash");
  const [cashReceived, setCashReceived] = useState("");

  // ✅ FIX 1: Ek hi state — receipt
  const [receipt,      setReceipt]      = useState(null);

  // ✅ FIX 2: Scan toast state
  const [scanToast, setScanToast] = useState({ show: false, found: false, productName: "" });
  const [isScanning, setIsScanning] = useState(false);

  const searchRef = useRef(null);

  const { data: productData, isLoading: loadingProducts } = useGetProductsQuery({
    search,
    page,
    category: catFilter,
    status: "active",
    limit: 18,
  });
  const { data: catData } = useGetCategoriesQuery({ limit: 100 });
  const [createSale, { isLoading: creating }] = useCreateSaleMutation();

  useEffect(() => { searchRef.current?.focus(); }, []);

  // ── Cart helpers ───────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.salePrice }
            : i
        );
      }
      return [...prev, {
        productId: product._id,
        name:      product.name,
        barcode:   product.barcode || "",
        salePrice: product.salePrice,
        quantity:  1,
        total:     product.salePrice,
        image:     product.image?.url || "",
        maxStock:  product.stock,
      }];
    });
  }, []);

  const incQty = (id) => setCart((prev) =>
    prev.map((i) => i.productId === id && i.quantity < i.maxStock
      ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.salePrice }
      : i
    )
  );

  const decQty = (id) => setCart((prev) =>
    prev.map((i) => i.productId === id
      ? i.quantity === 1 ? null : { ...i, quantity: i.quantity - 1, total: (i.quantity - 1) * i.salePrice }
      : i
    ).filter(Boolean)
  );

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.productId !== id));

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode("");
    setCashReceived("");
  };

  // ── Calculations ───────────────────────────────────────
  const subtotal    = cart.reduce((s, i) => s + i.total, 0);
  const discountAmt = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value
    : 0;
  const taxAmt    = Math.round((subtotal - discountAmt) * TAX_RATE);
  const grandTotal = subtotal - discountAmt + taxAmt;
  const change     = cashReceived ? Math.max(0, Number(cashReceived) - grandTotal) : 0;
  const totalItems  = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Coupon ─────────────────────────────────────────────
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
    } else {
      alert("Invalid coupon code!");
    }
  };

  // ✅ FIX 3: Barcode scanner — allProducts use karo (not just current page)
  // Isko backend se search karte hain barcode se
  const [allProducts, setAllProducts] = useState([]);

  // Jab bhi products load hon, allProducts update karo
  useEffect(() => {
    if (productData?.products) {
      setAllProducts((prev) => {
        const newIds = new Set(productData.products.map((p) => p._id));
        const filtered = prev.filter((p) => !newIds.has(p._id));
        return [...filtered, ...productData.products];
      });
    }
  }, [productData]);

  // ✅ FIX 4: Barcode scanner properly integrated
  useBarcodeScanner({
    enabled: true,
    onScan: (barcode) => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 800);

      const found = allProducts.find((p) => p.barcode === barcode);

      if (found && found.stock > 0) {
        addToCart(found);
        setScanToast({ show: true, found: true, productName: found.name });
      } else {
        setScanToast({ show: true, found: false, productName: "" });
      }
      setTimeout(() => setScanToast({ show: false, found: false, productName: "" }), 2000);
    },
  });

  // ── Checkout ───────────────────────────────────────────
  const handleCheckout = async () => {
    if (!cart.length) return;
    // if (payMethod === "cash" && (!cashReceived || Number(cashReceived) < grandTotal)) {
    //   alert("Cash received kam hai!");
    //   return;
    // }
    try {
      const payload = {
        items: cart.map((i) => ({
          product:   i.productId,
          name:      i.name,
          barcode:   i.barcode,
          salePrice: i.salePrice,
          quantity:  i.quantity,
          total:     i.total,
        })),
        subtotal,
        discount:      discountAmt,
        discountType:  appliedCoupon?.type || "flat",
        tax:           taxAmt,
        grandTotal,
        paymentMethod: payMethod,
        cashReceived:  payMethod === "cash" ? Number(cashReceived) : grandTotal,
        changeReturn:  change,
      };

      const response = await createSale(payload).unwrap();

      // ✅ FIX 5: Response se sale properly extract karo
      const savedSale = response?.sale || response?.data || response;
      setReceipt(savedSale);
      clearCart();
    } catch (err) {
      alert(err?.data?.message || "Sale failed!");
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Scan Toast */}
      <ScanToast
        show={scanToast.show}
        found={scanToast.found}
        productName={scanToast.productName}
      />

      {/* ── LEFT: Products ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ✅ FIX 6: Search bar — BarcodeSearchInput hata ke simple input lagaya */}
        {/* Reason: BarcodeSearchInput apna state manage karta tha, search filter nahi hota tha */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors
                ${isScanning ? "text-green-500 animate-pulse" : "text-gray-400"}`}
            />
            <input
              ref={searchRef}
              data-scanner="true"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={isScanning ? "Scanning..." : "Search ya barcode scan karo..."}
              className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors
                ${isScanning
                  ? "border-green-400 bg-green-50 focus:ring-green-300"
                  : "border-gray-200 focus:ring-indigo-500"
                }`}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Scan indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium flex-shrink-0 transition-colors
            ${isScanning ? "border-green-300 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
            <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
            {isScanning ? "Scanning..." : "Ready"}
          </div>

          {loadingProducts && <Loader2 size={18} className="animate-spin text-indigo-500 flex-shrink-0" />}
        </div>

        {/* Category tabs */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => { setCatFilter(""); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition
              ${!catFilter ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            All
          </button>
          {catData?.categories?.map((c) => (
            <button key={c._id}
              onClick={() => { setCatFilter(c._id); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition
                ${catFilter === c._id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loadingProducts ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
            </div>
          ) : productData?.products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Package size={40} className="opacity-30" />
              <p className="text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {productData?.products?.map((p) => (
                <PosProductCard key={p._id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {productData?.pages > 1 && (
          <div className="bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {productData.page} of {productData.pages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === productData.pages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Cart ── */}
      <div className="w-80 xl:w-96 bg-white border-l border-gray-100 flex flex-col shadow-xl">

        {/* Cart Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-indigo-600" />
            <span className="font-semibold text-gray-800">Cart</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition">
              <RotateCcw size={12} /> Clear
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <ShoppingCart size={36} className="opacity-20" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs text-gray-300">Click products to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem key={item.productId} item={item}
                onInc={incQty} onDec={decQty} onRemove={removeItem} />
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t border-gray-100 p-4 space-y-3">

          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
            {appliedCoupon ? (
              <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                className="px-3 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-medium flex items-center gap-1">
                <CheckCircle size={12} /> Applied
              </button>
            ) : (
              <button onClick={applyCoupon}
                className="px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">
                Apply
              </button>
            )}
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon?.type === "percent" ? `${appliedCoupon.value}%` : "flat"})</span>
                <span>- Rs. {discountAmt.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Tax (5%)</span>
              <span>Rs. {taxAmt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-1.5 border-t border-gray-200">
              <span>Total</span>
              <span className="text-indigo-600">Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-5 gap-1.5">
            {PAY_METHODS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setPayMethod(id)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-xs font-medium transition
                  ${payMethod === id
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500"
                  }`}>
                <Icon size={14} />
                <span className="leading-none">{label}</span>
              </button>
            ))}
          </div>

          {/* Cash Received */}
          {payMethod === "cash" && (
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Cash received..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              {cashReceived && Number(cashReceived) >= grandTotal && (
                <div className="flex justify-between text-sm font-medium text-green-700 bg-green-50 rounded-xl px-3 py-2">
                  <span>Change Return</span>
                  <span>Rs. {change.toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-1.5">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button key={amt} onClick={() => setCashReceived(String(amt))}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">
                    {amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={!cart.length || creating}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {creating
              ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
              : <><CheckCircle size={16} /> Checkout — Rs. {grandTotal.toLocaleString()}</>
            }
          </button>
        </div>
      </div>

      {/* ✅ FIX 7: Sirf ek Receipt Modal — receipt state use kar raha hai */}
      {receipt && (
        <ReceiptModal
          sale={receipt}
          onClose={() => setReceipt(null)}
          onNewSale={() => {
            setReceipt(null);
            setTimeout(() => searchRef.current?.focus(), 100);
          }}
        />
      )}
    </div>
  );
};

export default CashierPOS;