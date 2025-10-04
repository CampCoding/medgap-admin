"use client";

import { useEffect, useState } from "react";
import { useNavigation } from 'next/navigation';

export default function RouteLoader() {
  const navigation = useNavigation();
  const isLoading = navigation?.state === "loading";
  const [show, setShow] = useState(false);

  useEffect(() => {
    let t;
    if (isLoading) {
      // debounce to avoid flash on very fast transitions
      t = setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300 transform origin-left ${
        show ? "scale-x-100" : "scale-x-0"
      } bg-[#0F7490]`}
    />
  );
}
