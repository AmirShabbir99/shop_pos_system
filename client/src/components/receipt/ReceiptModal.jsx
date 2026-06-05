import { useRef } from "react";
import { X, Printer, Share2, Download } from "lucide-react";
import ThermalReceipt from "./ThermalReceipt";

const ReceiptModal = ({ sale, onClose, onNewSale }) => {
  const printRef = useRef(null);

  const handlePrint = () => window.print();

  const handleWhatsApp = () => {
    if (!sale) return;
    const items = sale.items?.map(
      (i) => `• ${i.name} x${i.quantity} = Rs.${i.total}`
    ).join("\n");

    const msg = `*${sale.saleNumber || "Receipt"}*\n\n${items}\n\n` +
      `Subtotal: Rs.${sale.subtotal}\n` +
      (sale.discount > 0 ? `Discount: -Rs.${sale.discount}\n` : "") +
      `Tax: Rs.${sale.tax}\n` +
      `*Total: Rs.${sale.grandTotal}*\n\n` +
      `Payment: ${sale.paymentMethod?.toUpperCase()}\n` +
      `Thank you! 🛍️`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Sale Complete! 🎉</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="overflow-y-auto max-h-[50vh] p-4 bg-gray-50 flex justify-center">
          <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
            <ThermalReceipt ref={printRef} sale={sale} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2 border-t border-gray-100">
          {/* Print */}
          <button onClick={handlePrint}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <Printer size={15} /> Print Receipt (80mm)
          </button>

          {/* WhatsApp */}
          <button onClick={handleWhatsApp}
            className="w-full py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2">
            <Share2 size={15} /> Share on WhatsApp
          </button>

          {/* New Sale */}
          <button onClick={() => { onClose(); onNewSale?.(); }}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;