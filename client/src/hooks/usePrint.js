import { useRef, useCallback } from "react";

export const usePrint = () => {
  const printRef = useRef(null);

  const handlePrint = useCallback(() => {
    if (!printRef.current) return;
    window.print();
  }, []);

  return { printRef, handlePrint };
};