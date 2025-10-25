"use client";

import { useState, useEffect, ReactNode } from "react";
import { SketchPicker } from "react-color";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  children?: ReactNode;
}

export default function CustomColorPicker({ value, onChange, children }: CustomColorPickerProps) {
  const [color, setColor] = useState(value || "#000000");
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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

  // Dark mode color scheme matching light mode appearance
  const darkModeStyles = isDark ? {
    picker: {
      boxShadow: 'none',
      width: '280px',
      backgroundColor: '#1e293b', // slate-800
      padding: '10px 10px 0',
      boxSizing: 'initial' as const,
    },
    saturation: {
      borderRadius: '2px',
    },
    hue: {
      borderRadius: '2px',
    },
    alpha: {
      borderRadius: '2px',
    },
    input: {
      width: '100%',
      fontSize: '11px',
      color: '#e2e8f0', // slate-200
      background: '#334155', // slate-700
      border: '1px solid #475569', // slate-600
      borderRadius: '2px',
      padding: '4px 10% 3px',
      boxShadow: 'inset 0 0 0 1px #475569',
    },
    label: {
      fontSize: '11px',
      color: '#cbd5e1', // slate-300
    },
    controls: {
      display: 'flex' as const,
    },
    activeColor: {
      background: '#334155', // slate-700
      borderRadius: '2px 2px 0 0',
    },
    color: {
      background: '#334155', // slate-700
      borderRadius: '2px',
    },
    swatch: {
      background: '#334155', // slate-700
    },
  } : {
    picker: {
      boxShadow: 'none',
      width: '280px',
    },
    input: {
      width: '100%',
      fontSize: '11px',
    }
  };

  return (
    <div className="relative">
      <div className="bg-white dark:bg-slate-800 rounded-md shadow-lg drop-shadow-xl overflow-hidden">
        <SketchPicker
          color={color}
          onChange={handleChange}
          presetColors={presetColors}
          width="280px"
          styles={{
            default: darkModeStyles
          }}
        />
        {children}
      </div>
    </div>
  );
}
