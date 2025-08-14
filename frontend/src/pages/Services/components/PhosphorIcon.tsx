import type { Icon } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";

interface PhosphorIconProps {
  name: string;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}

export default function PhosphorIcon({ 
  name, 
  size = 20, 
  weight = "regular", 
  className = "" 
}: PhosphorIconProps) {
  // Get the icon component by name
  const IconComponent = (PhosphorIcons as any)[name] as Icon;
  
  // Fallback if icon doesn't exist
  if (!IconComponent) {
    console.warn(`Phosphor icon "${name}" not found`);
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }
  
  return (
    <IconComponent 
      size={size} 
      weight={weight} 
      className={className}
    />
  );
}
