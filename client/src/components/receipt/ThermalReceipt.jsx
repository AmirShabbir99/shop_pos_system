import { forwardRef } from "react";

const ThermalReceipt = forwardRef(({ sale, storeName = "POS System", storePhone = "0300-1234567", storeAddress = "Lahore, Pakistan" }, ref) => {
  return (
    <div ref={ref} className="thermal-receipt">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .thermal-receipt,
          .thermal-receipt * { visibility: visible !important; }
          .thermal-receipt {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 80mm !important;
            padding: 4mm !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
        .thermal-receipt {
          width: 80mm;
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          color: #000;
          background: #fff;
          padding: 8px;
        }
        .thermal-receipt .center  { text-align: center; }
        .thermal-receipt .bold    { font-weight: bold; }
        .thermal-receipt .large   { font-size: 14px; }
        .thermal-receipt .divider { border-top: 1px dashed #000; margin: 6px 0; }
        .thermal-receipt .row     { display: flex; justify-content: space-between; margin: 2px 0; }
        .thermal-receipt .row-3   { display: grid; grid-template-columns: 1fr auto auto; gap: 4px; margin: 2px 0; }
        .thermal-receipt .right   { text-align: right; }
        .thermal-receipt .small   { font-size: 10px; }
      `}</style>

      {/* Store Header */}
      <div className="center bold large">{storeName}</div>
      <div className="center small">{storeAddress}</div>
      <div className="center small">Tel: {storePhone}</div>

      <div className="divider" />

      {/* Sale Info */}
      <div className="row">
        <span>Receipt#:</span>
        <span className="bold">{sale?.saleNumber}</span>
      </div>
      <div className="row">
        <span>Date:</span>
        <span>{new Date(sale?.createdAt || Date.now()).toLocaleString("en-PK", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}</span>
      </div>
      <div className="row">
        <span>Cashier:</span>
        <span>{sale?.cashier?.name || "—"}</span>
      </div>

      <div className="divider" />

      {/* Items Header */}
      <div className="row-3 bold small">
        <span>Item</span>
        <span className="right">Qty</span>
        <span className="right">Total</span>
      </div>
      <div className="divider" />

      {/* Items */}
      {sale?.items?.map((item, i) => (
        <div key={i}>
          <div className="small">{item.name}</div>
          <div className="row-3 small">
            <span className="small" style={{ color: "#555" }}>
              Rs.{item.salePrice} x {item.quantity}
            </span>
            <span className="right">{item.quantity}</span>
            <span className="right bold">Rs.{item.total?.toLocaleString()}</span>
          </div>
        </div>
      ))}

      <div className="divider" />

      {/* Totals */}
      <div className="row small">
        <span>Subtotal:</span>
        <span>Rs. {sale?.subtotal?.toLocaleString()}</span>
      </div>
      {sale?.discount > 0 && (
        <div className="row small">
          <span>Discount:</span>
          <span>- Rs. {sale?.discount?.toLocaleString()}</span>
        </div>
      )}
      <div className="row small">
        <span>Tax (5%):</span>
        <span>Rs. {sale?.tax?.toLocaleString()}</span>
      </div>

      <div className="divider" />

      <div className="row bold large">
        <span>TOTAL:</span>
        <span>Rs. {sale?.grandTotal?.toLocaleString()}</span>
      </div>

      <div className="divider" />

      {/* Payment */}
      <div className="row small">
        <span>Payment:</span>
        <span className="bold" style={{ textTransform: "uppercase" }}>{sale?.paymentMethod}</span>
      </div>
      {sale?.paymentMethod === "cash" && (
        <>
          <div className="row small">
            <span>Cash Received:</span>
            <span>Rs. {sale?.cashReceived?.toLocaleString()}</span>
          </div>
          <div className="row small bold">
            <span>Change:</span>
            <span>Rs. {sale?.changeReturn?.toLocaleString()}</span>
          </div>
        </>
      )}

      <div className="divider" />

      {/* Footer */}
      <div className="center small" style={{ marginTop: "4px" }}>
        Items: {sale?.items?.reduce((s, i) => s + i.quantity, 0)}
      </div>
      <div className="center bold" style={{ marginTop: "6px", fontSize: "12px" }}>
        Thank You! Please Come Again
      </div>
      <div className="center small" style={{ marginTop: "2px", color: "#555" }}>
        Software by POS System v1.0
      </div>

      {/* Barcode area */}
      <div className="center" style={{ marginTop: "8px", letterSpacing: "4px", fontSize: "10px" }}>
        |||||||||||||||||||||||||||||||
      </div>
      <div className="center small">{sale?.saleNumber}</div>

      {/* Cut line */}
      <div style={{ borderTop: "2px dashed #000", marginTop: "10px", textAlign: "center", fontSize: "10px", paddingTop: "2px" }}>
        ✂ - - - - - - - - - - - - - - -
      </div>
    </div>
  );
});

ThermalReceipt.displayName = "ThermalReceipt";
export default ThermalReceipt;