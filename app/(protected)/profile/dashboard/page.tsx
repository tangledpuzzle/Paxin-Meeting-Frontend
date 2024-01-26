'use client';

import { MdDashboard } from 'react-icons/md';

import { Separator } from '@/components/ui/separator';
import CTASection from '@/components/profiles/cta';

export default function DashboardPage() {
  return (
    <div className='p-4'>
      <CTASection
        title='Dashboard'
        description='You can view all the stats and Analytics related to you'
        icon={MdDashboard}
      />
      <Separator className='my-4' />
    </div>
  );
}
