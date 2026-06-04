import { useState } from "react";
import { useGetSalesQuery, useGetSaleByIdQuery } from "../features/sale/saleApi";
import { Printer, Search, X, Loader2, FileText } from "lucide-react";

const InvoiceSection = () => {
  const [search, setSearch] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const { data, isLoading, isError } = useGetSalesQuery();
  const { data: invoiceData } = useGetSaleByIdQuery(selectedInvoiceId, {
    skip: !selectedInvoiceId,
  });

  const invoices = data?.sales || [];
  const filteredInvoices = invoices.filter((inv) => {
    const number = String(inv.saleNumber || inv.invoiceNumber || inv._id || "");
    return number.toLowerCase().includes(search.toLowerCase());
  });

  const invoice = invoiceData?.sale;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Invoices</h2>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={28} className="animate-spin text-indigo-500" />
              </div>
            ) : isError ? (
              <p className="text-red-500 text-sm">Failed to load invoices.</p>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No invoices found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {filteredInvoices.map((inv) => (
                  <button
                    key={inv._id}
                    onClick={() => setSelectedInvoiceId(inv._id)}
                    className="w-full text-left border border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          Invoice #{inv.saleNumber || inv.invoiceNumber || inv._id}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(inv.createdAt).toLocaleString("en-PK")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-indigo-600">
                          Rs. {inv.grandTotal?.toLocaleString?.() || inv.grandTotal}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{inv.paymentMethod}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Invoice Preview</h2>
              {invoice && (
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                >
                  <Printer size={14} /> Print
                </button>
              )}
            </div>

            {!invoice ? (
              <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">
                Select an invoice to preview
              </div>
            ) : (
              <div className="text-sm">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-gray-800">POS System</h3>
                  <p className="text-gray-500 text-xs">
                    {new Date(invoice.createdAt).toLocaleString("en-PK")}
                  </p>
                  <p className="text-indigo-600 font-medium mt-1">
                    Invoice #: {invoice.saleNumber || invoice.invoiceNumber || invoice._id}
                  </p>
                </div>

                <div className="border-t border-dashed border-gray-200 my-3" />

                <div className="space-y-2 mb-3">
                  {invoice.items?.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} x Rs. {item.salePrice}
                        </p>
                      </div>
                      <span className="font-medium text-gray-700">Rs. {item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 my-3" />

                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {invoice.subtotal}</span>
                  </div>

                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- Rs. {invoice.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {invoice.tax}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100 mt-1">
                    <span>Total</span>
                    <span>Rs. {invoice.grandTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSection;