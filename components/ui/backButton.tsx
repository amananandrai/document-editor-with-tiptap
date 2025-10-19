"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate to previous page
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer
                 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <ArrowLeft size={20} />
      <span className="font-medium">Back</span>
    </button>
  );
}