import React, { useState } from 'react';
import { ColorPicker, hsbToHex, type HSBColor } from '@shopify/polaris';

export default function ColorPickerField({ value, onChange }: { value: string; onChange: (hex: string) => void; }) {
  const [hsb, setHsb] = useState<HSBColor>({ hue: 120, saturation: 0.6, brightness: 0.6 });
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 240 }}>
        <ColorPicker color={hsb} onChange={(c) => { setHsb(c); onChange(hsbToHex(c)); }} allowAlpha={false} />
      </div>
      <div style={{ width: 60, height: 60, border: '1px solid #ddd', background: value }} />
    </div>
  );
}
