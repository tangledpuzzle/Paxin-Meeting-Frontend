import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface ProductProps {
  title: string;
  id: number;
  onToggle: (id: number) => void;
  checked: boolean;
  price: string;
}
export default function Product({
  id,
  checked,
  title,
  price,
  onToggle,
}: ProductProps) {
  return (
    <>
      <div className='flex flex-row items-center gap-3'>
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle(id)}
          id={title}
        />
        <div>
          <p> {title}</p>
          {parseInt(price)!=0?<p>${price}</p>:null}
        </div>
      </div>
      <div
        data-orientation='horizontal'
        role='none'
        className='my-4 h-[1px] w-full shrink-0 bg-border'
      ></div>
    </>
  );
}
