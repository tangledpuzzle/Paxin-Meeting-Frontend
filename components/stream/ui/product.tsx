import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface ProductProps {
  title: string;
  id: number;
  onToggle: (id: number) => void;
  checked: boolean;
}
export default function Product({
  id,
  checked,
  title,
  onToggle,
}: ProductProps) {
  return (
    <div className='flex flex-row items-center gap-3'>
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle(id)}
        id={title}
      />
      <span> {title}</span>
    </div>
  );
}
