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
    const { r, g, b, a } = color.rgb;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    setColor(rgbaColor);
    onChange(rgbaColor);
  };

  // Preset colors - we'll add transparent manually
  const presetColors = [
    '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505',
    '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000',
    '#4A4A4A', '#9B9B9B', '#FFFFFF'
  ];

  // Custom rendering with transparent color
  const handleTransparentClick = () => {
    const transparentColor = 'rgba(0, 0, 0, 0)';
    setColor(transparentColor);
    onChange(transparentColor);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-md shadow-lg drop-shadow-xl">
        <SketchPicker
          color={color}
          onChange={handleChange}
          presetColors={presetColors}
          width="280px"
          styles={{
            default: {
              picker: {
                boxShadow: 'none',
                width: '280px',
              },
              input: {
                width: '100%',
                fontSize: '11px',
              }
            }
          }}
        />
        {children}
      </div>
    </div>
  );
}
