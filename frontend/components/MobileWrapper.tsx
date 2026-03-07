import React from "react";

export function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-xl overflow-hidden border-8 border-gray-900">
        {children}
      </div>
    </div>
  );
}
