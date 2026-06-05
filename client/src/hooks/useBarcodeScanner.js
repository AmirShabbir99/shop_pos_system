import { useEffect, useRef, useCallback } from "react";

const useBarcodeScanner = ({ onScan, enabled = true }) => {
  const bufferRef   = useRef("");
  const timerRef    = useRef(null);
  const lastKeyTime = useRef(0);

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;

    // Ignore modifier keys
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    // Ignore if user is typing in input/textarea (except our designated scan input)
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "textarea") return;

    // Input fields pe scanner kaam kare — sirf agar "data-scanner" attribute ho
    if (tag === "input" && !document.activeElement?.dataset?.scanner) return;

    const now = Date.now();
    const timeDiff = now - lastKeyTime.current;
    lastKeyTime.current = now;

    // Barcode scanner bohot fast type karta hai (< 50ms per char)
    // Agar slow typing hai toh ignore karo
    if (timeDiff > 100 && bufferRef.current.length > 0) {
      bufferRef.current = "";
    }

    if (e.key === "Enter") {
      if (bufferRef.current.length >= 3) {
        onScan(bufferRef.current.trim());
      }
      bufferRef.current = "";
      clearTimeout(timerRef.current);
      return;
    }

    // Only alphanumeric chars
    if (e.key.length === 1) {
      bufferRef.current += e.key;
    }

    // Auto clear buffer after 200ms (scanner finishes fast)
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      bufferRef.current = "";
    }, 200);
  }, [enabled, onScan]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [handleKeyDown]);
};

export default useBarcodeScanner;