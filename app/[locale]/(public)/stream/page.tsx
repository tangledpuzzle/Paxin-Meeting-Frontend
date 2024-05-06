'use client';

import { CTASection } from '@/components/stream/cta';
import FlowSection from '@/components/stream/flow';
import apiHelper from '@/helpers/api/apiRequest';
import { scrollToTransition } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface IRoom {
  roomId: string;
  publisher: {
    userID: string;
    photo: string;
    name: string;
    telegramname: string;
  };
  title: string;
  productImages: string[];
}
// Dummy data here🥱🥱
const _DUMMI_DATA = [
  {
    id: '2131521233534',
    publisherId: '5df5aab6-9e18-4538-b80d-23a8b9d24c3f',
    title: 'Hey gen.',
    roomId: 'sdf3-234d-bad',
  },
  {
    id: '2131521233533',
    publisherId: '21321-4242-5341gs-52gdb32fg',
    title: 'Hey gen.',
    roomId: 'sdf3-234d-bac',
  },
  {
    id: '213152129763534',
    publisherId: '5df5aab6-9e18-4538-b80d-23a8b9d24c3f',
    title: 'Shopping',
    roomId: 'sdf3-234d-bae',
  },
  {
    id: '2131521233535',
    publisherId: '21321-42n2-5341gs-52gdbffg',
    title: 'LLLLLLy gen.',
    roomId: 'sdf3-234d-baf',
  },
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const [rooms, setRooms] = useState<Array<IRoom>>([]);
  console.log(data);
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'me'
  );
  const [titleKeyword, setTitleKeyword] = useState<string>(
    searchParams.get('title') || 'all'
  );
  useEffect(() => {
    async function init() {
      const response = await apiHelper({
        url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'rooms/All',
      });
      console.log(response);
      if (response.status !== 'success') {
        toast.error('API error');
      } else {
        const _rooms = [];
        for (let i of Object.keys(response.rooms)) {
          const images = [];
          for (let im of response.rooms[i].products) {
            im.photos.length && images.push(im.photos[0].files[0].path);
          }
          console.log(response.rooms[i].products);
          _rooms.push({
            roomId: i,
            title: response.rooms[i].title,
            publisher: response.rooms[i].publisher,
            productImages: images,
          });
        }
        setRooms(_rooms);
      }
    }
    init();
  }, [viewMode]);
  useEffect(() => {
    setViewMode(searchParams.get('mode') || 'me');
  }, [searchParams]);

  useEffect(() => {
    const saveScrollPosition = () => {
      if (window === undefined) return;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'home-page-scroll-position',
          (window.scrollY || document.documentElement.scrollTop).toString()
        );
      }
    };
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (window === undefined) return;

    if (typeof localStorage !== 'undefined') {
      const savedPosition = localStorage.getItem('home-page-scroll-position');
      if (savedPosition) {
        scrollToTransition(Number(savedPosition));

        localStorage.removeItem('home-page-scroll-position');
      }
    }
  }, []);

  const myRooms = rooms.filter((el) => el.publisher.userID === data?.user?.id);
  const otherRooms = rooms.filter(
    (el) => el.publisher.userID !== data?.user?.id
  );
  return (
    <section className='container'>
      <CTASection />
      {viewMode === 'other' ? (
        <FlowSection
          data={
            titleKeyword == 'all'
              ? otherRooms
              : otherRooms.filter((el) => el.title.includes(titleKeyword))
          }
        />
      ) : viewMode === 'me' ? (
        <FlowSection
          data={
            titleKeyword == 'all'
              ? myRooms
              : myRooms.filter((el) => el.title.includes(titleKeyword))
          }
        />
      ) : null}
    </section>
  );
}
