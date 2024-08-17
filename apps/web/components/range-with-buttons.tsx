import AddIcon from '@/icons/add-icon';
import RemoveIcon from '@/icons/remove-icon';
import { useRef, useState } from 'react';

interface RangeWithButtonsProps {
  min: number;
  max: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
}

export default function RangeWithButtons({
  min,
  max,
  step = 1,
  value = min,
  onChange,
}: RangeWithButtonsProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (isAdd: boolean) => {
    const input = ref.current;
    if (!input) return;

    const { value, step, min, max } = input;
    const numericValue = Number(value);
    const numericStep = Number(step);

    if (
      (numericValue === Number(min) && !isAdd) ||
      (numericValue === Number(max) && isAdd)
    )
      return;

    const newValue = numericValue + (isAdd ? numericStep : -numericStep);
    input.value = newValue.toString();
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex items-center space-x-1">
        <button
          className="btn btn-sm btn-ghost btn-square"
          onClick={() => handleChange(false)}
        >
          <RemoveIcon className="size-4" />
        </button>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="range range-sm"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button
          className="btn btn-sm btn-ghost btn-square"
          onClick={() => handleChange(true)}
        >
          <AddIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
