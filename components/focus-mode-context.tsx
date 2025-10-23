"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(
  undefined
);

export const FocusModeProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // ✅ Load focus mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("focusMode");
    if (savedMode === "true") setIsFocusMode(true);
  }, []);

  // ✅ Persist focus mode to localStorage
  useEffect(() => {
    localStorage.setItem("focusMode", String(isFocusMode));
  }, [isFocusMode]);

  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);

  // ✅ Keyboard Shortcut (Ctrl + Shift + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode }}>
      {children}

      {/* ✅ Floating Exit Button */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-[9999]"
          >
            <Button
              onClick={toggleFocusMode}
              variant="default"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <Eye size={18} />
              Exit Focus
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
};
