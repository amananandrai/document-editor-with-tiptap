import { useState, useEffect, ReactNode } from "react";
import {
  HexColorPicker,
  RgbColorPicker,
  HslColorPicker,
} from "react-colorful";
import { Button } from "./button";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  children?: ReactNode;
}

export default function CustomColorPicker({ value, onChange, children }: CustomColorPickerProps) {
  const [mode, setMode] = useState<"hex" | "rgb" | "hsl">("hex");
  const [color, setColor] = useState(value || "#000000");
  const [hslColor, setHslColor] = useState(hexToHsl(value || "#000000")); // for HSL mode
  // We need to do this for HSL specifically because otherwise it leads to a "Maximum update depth exceeded" error due to how we are handling state

  // Sync incoming prop only if it changed
  useEffect(() => {
    if (value !== color) {
      setColor(value);
    }
  }, [value]);

  // Handler for color picker changes
  const handleChange = (newColor: string) => {
    if (newColor !== color) {
      setColor(newColor);
      onChange(newColor); // propagate change
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "hex" ? "rgb" : m === "rgb" ? "hsl" : "hex"));
  };

  const picker =
    mode === "hex" ? (
      <HexColorPicker color={color} onChange={handleChange} />
    ) : mode === "rgb" ? (
      <RgbColorPicker
        color={hexToRgb(color)}
        onChange={(c) => handleChange(rgbToHex(c))}
      />
    ) : (
      <HslColorPicker
          color={hslColor}
          onChange={(c) => {
            setHslColor(c); // update internal HSL state
            handleChange(hslToHex(c)); // propagate HEX to parent
          }}
        />
    );

  return (
    <div className="relative">
      <div className="relative p-3 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 border shadow-lg">
        <div className="flex justify-between items-center mb-2">
          
        </div>
        {picker}
        
        <div className="text-xs pt-2 flex justify-between content-center items-center">
            {
                mode==='hex' ? (
                    <div>HEX: {color.toUpperCase()}</div>
                ) : mode==='rgb' ? (
                    <div>RGB: {Object.values(hexToRgb(color)).join(", ")}</div>
                ) : (
                    <div>
                        HSL:{" "}
                        {(() => {
                          const { h, s, l } = hexToHsl(color);
                          return `${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`;
                        })()}
                    </div>
                )
            }
            <div className="flex, justify-end">
              {/* Screen color picker button */}
              <button
                onClick={async () => {
                  if ("EyeDropper" in window) {
                    try {
                      // @ts-ignore
                      const eyeDropper = new EyeDropper();
                      const result = await eyeDropper.open();
                      handleChange(result.sRGBHex);
                    } catch (err) {
                      console.error("Eyedropper cancelled or failed:", err);
                    }
                  } else {
                    alert("EyeDropper API not supported in this browser.");
                  }
                }}
                className="text-xs border px-2 py-1 mr-1 rounded border-gray-200 dark:border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300"
                title="Pick color from screen"
              >
                🗡
              </button>
              {/* Mode switch button */}
              <button
                onClick={toggleMode}
                className="text-xs border px-2 py-1 rounded border-gray-200 dark:border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300"
                        >
                ⇆
              </button>
            </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- conversion helpers ---
function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex({ r, g, b }: any) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const h = x.toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("")
  );
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm),
    min = Math.min(rNorm, gNorm, bNorm);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: any) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}