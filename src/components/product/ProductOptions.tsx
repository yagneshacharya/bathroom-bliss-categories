import { useState } from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface SizeOption {
  name: string;
  value: string;
  dimensions: string;
}

interface MaterialOption {
  name: string;
  value: string;
}

interface ProductOptionsProps {
  colors: ColorOption[];
  sizes: SizeOption[];
  materials: MaterialOption[];
  selectedColor: string;
  selectedSize: string;
  selectedMaterial: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onMaterialChange: (material: string) => void;
}

const ProductOptions = ({
  colors,
  sizes,
  materials,
  selectedColor,
  selectedSize,
  selectedMaterial,
  onColorChange,
  onSizeChange,
  onMaterialChange,
}: ProductOptionsProps) => {
  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Finish: <span className="font-semibold text-accent">{colors.find(c => c.value === selectedColor)?.name}</span>
        </Label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                selectedColor === color.value
                  ? "border-accent ring-2 ring-accent ring-offset-2"
                  : "border-border hover:border-accent/50"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <Check 
                  className={`absolute inset-0 m-auto h-5 w-5 ${
                    color.hex === "#FFFFFF" || color.hex === "#F5F5F5" 
                      ? "text-charcoal" 
                      : "text-white"
                  }`} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size/Dimension Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Size & Dimensions</Label>
        <RadioGroup
          value={selectedSize}
          onValueChange={onSizeChange}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {sizes.map((size) => (
            <Label
              key={size.value}
              htmlFor={size.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                selectedSize === size.value
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <RadioGroupItem value={size.value} id={size.value} />
              <div>
                <p className="font-medium text-foreground">{size.name}</p>
                <p className="text-sm text-muted-foreground">{size.dimensions}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Material Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Material</Label>
        <RadioGroup
          value={selectedMaterial}
          onValueChange={onMaterialChange}
          className="flex flex-wrap gap-3"
        >
          {materials.map((material) => (
            <Label
              key={material.value}
              htmlFor={material.value}
              className={`cursor-pointer rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all ${
                selectedMaterial === material.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground hover:border-accent/50"
              }`}
            >
              <RadioGroupItem
                value={material.value}
                id={material.value}
                className="sr-only"
              />
              {material.name}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ProductOptions;
