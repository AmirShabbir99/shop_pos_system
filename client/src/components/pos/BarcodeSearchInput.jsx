import { useState, useRef, useEffect } from "react";
import { Scan, X, Loader2 } from "lucide-react";

const BarcodeSearchInput = ({ onProductFound, products = [], isScanning }) => {
  const [value,   setValue]   = useState("");
  const [flash,   setFlash]   = useState(false); // green flash on scan
  const inputRef = useRef(null);

  // Auto focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = (val) => {
    if (!val.trim()) return;
    const found = products.find(
      (p) =>
        p.barcode === val.trim() ||
        p.name.toLowerCase().includes(val.toLowerCase())
    );
    if (found) {
      onProductFound(found, "barcode");
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
      setValue("");
    } else {
      // Red flash - not found
      inputRef.current?.select();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(value);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className={`relative flex-1 transition-all duration-200 ${flash ? "ring-2 ring-green-400 rounded-xl" : ""}`}>
        <Scan
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            isScanning ? "text-green-500 animate-pulse" : "text-gray-400"
          }`}
        />
        <input
          ref={inputRef}
          data-scanner="true"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Barcode scan karo ya type karo..."
          className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors
            ${flash
              ? "border-green-400 bg-green-50 focus:ring-green-300"
              : "border-gray-200 focus:ring-indigo-500"
            }`}
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Scan status indicator */}
      <div className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors
        ${isScanning
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-50 text-gray-500"
        }`}>
        <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
        {isScanning ? "Scanning..." : "Ready"}
      </div>
    </div>
  );
};

export default BarcodeSearchInput;