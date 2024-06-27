'use client';

import { CTASection } from '@/components/stream/cta';
import FlowSection from '@/components/stream/flow';
import apiHelper from '@/helpers/api/apiRequest';
import { scrollToTransition } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocale } from 'next-intl';
import axios from 'axios';
import useSWR from 'swr';

export interface IRoom {
  roomId: string;
  publisher: {
    userID: string;
    photo: string;
    name: string;
    telegramname: string;
  };
  cnt: number;
  title: string;
  productImages: string[];
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function HomePage() {
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const [rooms, setRooms] = useState<Array<IRoom>>([]);
  console.log('datadata', data);
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'all'
  );
  const [titleKeyword, setTitleKeyword] = useState<string>(
    searchParams.get('title') || 'all'
  );
  useEffect(() => {
    async function init() {
      const response = await apiHelper({
        url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'rooms/All',
      });
      console.log('111111111111', response);
      if (response.status !== 'success') {
        toast.error('API error');
      } else {
        const _rooms = [];
        for (let i of Object.keys(response.rooms)) {
          const images = [];
          for (let im of response.rooms[i].products) {
            im.photos.length && images.push(im.photos[0].files[0].path);
          }
          console.log(response);
          _rooms.push({
            roomId: i,
            cnt:10,
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
    setViewMode(searchParams.get('mode') || 'all');
  }, [searchParams]);

  const locale = useLocale();
  const pageSize = 12;
  const [fetchURL, setFetchURL] = useState('');
  const { data: fetchedData, isLoading, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    if (!error && fetchedData) {
      setRooms(fetchedData.data);
    }
  }, [fetchedData, error]);
  
  useEffect(() => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';
    const _page = Number(searchParams.get('page') || 1);

    setFetchURL(
      `/api/rooms/get?language=${locale}&limit=${pageSize}&skip=${(_page - 1) * pageSize}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}`
    );
  }, [searchParams, locale]);

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

  const flag=status==='authenticated'
  const myRooms = rooms.filter((el) => el.publisher.userID === data?.user?.id);
  const otherRooms = rooms.filter(
    (el) => el.publisher.userID !== data?.user?.id
  );
  return (
    <section className='container'>
      <CTASection choice={flag} />
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
      ) : <FlowSection
      data={
        titleKeyword == 'all'
        ? rooms
        : rooms.filter((el) => el.title.includes(titleKeyword))
      }
    />}
    </section>
  );
}
