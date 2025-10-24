import { useState, useEffect, ReactNode } from "react";
import { SketchPicker } from "react-color";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  children?: ReactNode;
}

export default function CustomColorPicker({ value, onChange, children }: CustomColorPickerProps) {
  const [color, setColor] = useState(value || "#000000");

  // Sync incoming prop only if it changed
  useEffect(() => {
    if (value !== color) {
      setColor(value);
    }
  }, [value, color]);

  // Handler for color picker changes
  const handleChange = (color: any) => {
    setColor(color.hex);
    onChange(color.hex);
  };

  return (
    <div className="relative">
      <SketchPicker color={color} onChange={handleChange} />
      {children}
    </div>
  );
}
