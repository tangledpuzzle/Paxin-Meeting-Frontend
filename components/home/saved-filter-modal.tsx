import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import toast from "react-hot-toast";
import { useSwipe } from '@/components/ui/mobileswipe';
import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import usePreventBodyScroll from '@/components/ui/scrollmouse';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useRouter, useSearchParams } from 'next/navigation';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
export function SavedFilterModal({ setIsFilterModalOpen }: any) {
  const t = useTranslations('main');
  const locale = useLocale();
  const router = useRouter();

  const [isFilterModalOpen, setModalOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [filtersList, setFiltersList] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<null | number>(null);
  const [newName, setNewName] = useState('');

  const getfilters = async () => {
    const filters = await axios.get('/api/flows/filter');
    setFiltersList(filters.data.data);
  }
  useEffect(() => {
    getfilters();
  }, [])

  const deleteFilter = async (id: any, key: any) => {
    const result = await axios.delete(`/api/flows/filter/${id}`);

    if (result.status === 200) {
      toast.success(t('success_delete_saved_filters'))
      let _filtersList = [];
      for (let i = 0; i < filtersList.length; i++) {
        if (i !== key) _filtersList.push(filtersList[i]);
      }
      setFiltersList(_filtersList);
    } else {
      toast.error(t('fail_delete_saved_filters'))
    }
  }

  const navigateUrl = (each: any) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const _hashtag = each.hashtag ? each.hashtag : 'all';
    const _city = each.city ? each.city : 'all';
    const _category = each.category ? each.category : 'all';
    const minPrice = each.money.split('-')[0];
    const maxPrice = each.money.split('-')[1];
    const _money =
      minPrice && maxPrice
        ? `${minPrice}-${maxPrice}`
        : minPrice
          ? minPrice
          : maxPrice
            ? `0-${maxPrice}`
            : 'all';

    let _page = searchParams.get('page') || '1';

    if (_city !== newSearchParams.get('city')) _page = '1';
    if (_category !== newSearchParams.get('category')) _page = '1';
    if (_hashtag !== newSearchParams.get('hashtag')) _page = '1';
    if (_money !== newSearchParams.get('money')) _page = '1';

    newSearchParams.set('page', _page);
    newSearchParams.set('city', _city);
    newSearchParams.set('category', _category);
    newSearchParams.set('hashtag', _hashtag);
    newSearchParams.set('money', _money);

    router.push(`?${newSearchParams.toString()}`);
    setModalOpen(false);
    setIsFilterModalOpen(false);
  }
  const updateFilter = async (id: any, each: any) => {
    const result = await axios.patch(`/api/flows/filter/${id}`, { data: { ...each, Name: newName } });

    let _filtersList = filtersList.map((each, key) => {
      if (key == editMode) {
        return { ...each, Name: newName }
      } else {
        return each
      }
    });
    setFiltersList(_filtersList);
    setEditMode(null);
    if (result.status === 200) {
      toast.success(t('success_update_saved_filters'))
    } else {
      toast.error(t('fail_update_saved_filters'))
    }
  }
  const { onTouchEnd, onTouchMove, onTouchStart } = useSwipe();
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }
  React.useEffect(() => {
    if (containerRef.current && !containerWidth) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef, containerWidth]);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Dialog open={isFilterModalOpen} onOpenChange={setModalOpen} >
      <DialogTrigger asChild>
        <Button type='button' >
          {t('saved_filters')}
        </Button>
      </DialogTrigger>
      <DialogContent className=' max-w-3xl rounded-lg sm:mx-auto'>
        <DialogHeader>
          <DialogTitle>{t('saved_filters')} </DialogTitle>
        </DialogHeader>
        {filtersList.map((each, key) =>
          <div className='flex justify-between gap-4' key={key}>
            {editMode == key ?
              <Input className='w-[20%]' value={newName} onChange={(event) => { setNewName(event.target.value) }}></Input> :
              <Button className='w-[20%] flex items-center bg-transparent text-black shadow-none hover:bg-transparent dark:text-white' onClick={() => navigateUrl(each.Meta)}>
                {each.Name}
              </Button>
            }
            <div className='flex gap-2 w-[70%] overflow-hidden'>
              <div className='relative max-w-[100%] w-full'>
                <div ref={containerRef}>
                  <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
                    <ScrollMenu
                      onWheel={onWheel}
                      onTouchEnd={onTouchEnd}
                      onTouchMove={onTouchMove}
                      onTouchStart={onTouchStart}
                    >
                      {each.Meta.category && <div className='bg-card-gradient-menu px-2 rounded-lg  flex items-center whitespace-nowrap'>{each.Meta.category}</div>}
                      {each.Meta.city && <div className='bg-card-gradient-menu px-2 rounded-lg  flex items-center whitespace-nowrap' >{each.Meta.city}</div>}
                      {each.Meta.hashtag && <div className='bg-card-gradient-menu px-2 rounded-lg  flex items-center whitespace-nowrap'>{each.Meta.hashtag}</div>}
                      {each.Meta.money !== '-' && <div className='bg-card-gradient-menu px-2 rounded-lg  flex items-center whitespace-nowrap'  >{each.Meta.money}</div>}
                      {each.Meta.title && <div className='bg-card-gradient-menu px-2 rounded-lg  flex items-center whitespace-nowrap'>{each.Meta.title}</div>}
                    </ScrollMenu>
                  </div>
                </div>
              </div>
              {/* <TagSlider tags={["wewew", "wewewewe"]} /> */}
            </div>
            {editMode == key ?
              <Button type='submit' className='mr-3' onClick={() => updateFilter(each.ID, each)}>
                <FaCheck />
              </Button> :
              <Button type='submit' className='mr-3' onClick={() => { setEditMode(key); setNewName(each.Name) }}>
                <FaEdit />
              </Button>
            }
            {editMode == key ?
              <Button type='submit' className='mr-3' variant='destructive' onClick={() => setEditMode(null)}>
                <FaTimes />
              </Button> :
              <Button type='submit' className='mr-3' variant='destructive' onClick={() => { deleteFilter(each.ID, key) }}>
                <FaTrash />
              </Button>
            }
          </div>
        )}
      </DialogContent>
    </Dialog >
  );
}
