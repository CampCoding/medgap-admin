import { Phone } from "lucide-react";
import React from "react";

const FloatingButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-20">
      <button className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-pulse">
        <Phone className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingButton;
