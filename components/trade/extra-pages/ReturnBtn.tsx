import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
export default function ReturnBtn() {
  const router = useRouter();
  function goBack() {
    router.push('/profile/conference');
  }
  return <Button onClick={goBack}>Go Back</Button>;
}
