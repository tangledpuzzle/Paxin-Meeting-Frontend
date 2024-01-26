'use client';

import { usePaxContext } from '@/context/context';
import { Search } from 'lucide-react';
import { MdOutlinePostAdd } from 'react-icons/md';
import { RiArticleLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CTASection from '@/components/profiles/cta';
import { NewPostModal } from '@/components/profiles/posts/new-post-modal';
import { PostCard, PostCardProps } from '@/components/profiles/posts/post-card';

const posts: PostCardProps[] = [
  {
    id: 1,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: true,
  },
  {
    id: 2,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: true,
  },
  {
    id: 3,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: true,
  },
  {
    id: 4,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: false,
  },
  {
    id: 5,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: false,
  },
  {
    id: 6,
    title: 'Metaverse Metaverse Metaverse Metaverse Metaverse',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet, consectetur adipiscing elit',
    hashtags: ['#Personal Realtor', '#Personal Realtor', '#Personal Realtor'],
    expireDate: '22/12/2020',
    cities: ['Moscow'],
    categories: ['Technology'],
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    archived: false,
  },
];

export default function MyPostsPage() {
  const { postMode, setPostMode } = usePaxContext();

  return (
    <div className='p-4'>
      <CTASection
        title='My Posts'
        description='You can view all posts created by you'
        icon={RiArticleLine}
      />
      <Separator className='my-4' />
      <div className='mb-2 flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
          <Input type='text' placeholder='Search' className='pl-12 pr-4' />
        </div>
        <div className='flex w-full items-center justify-between gap-2 sm:w-auto'>
          <div className='grid h-9 grid-cols-2 gap-2 rounded-lg bg-background p-1 px-2'>
            <Button
              className='h-7 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
              data-state={postMode === 'all' ? 'active' : ''}
              onClick={() => setPostMode('all')}
            >
              All
            </Button>
            <Button
              className='h-7 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
              data-state={postMode === 'archived' ? 'active' : ''}
              onClick={() => setPostMode('archived')}
            >
              Archived
            </Button>
          </div>
          <NewPostModal>
            <Button>
              <MdOutlinePostAdd className='mr-2 h-5 w-5' />
              New Post
            </Button>
          </NewPostModal>
        </div>
      </div>
      <div className='w-full'>
        {postMode === 'all' ? (
          <ScrollArea className='h-[calc(100vh_-_18rem)] rounded-lg bg-background p-4'>
            {posts
              .filter((post) => !post.archived)
              .map((post) => (
                <>
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    subtitle={post.subtitle}
                    content={post.content}
                    hashtags={post.hashtags}
                    expireDate={post.expireDate}
                    cities={post.cities}
                    categories={post.categories}
                    gallery={post.gallery}
                    archived={post.archived}
                  />
                  <Separator className='my-4' />
                </>
              ))}
          </ScrollArea>
        ) : postMode === 'archived' ? (
          <ScrollArea className='h-[calc(100vh_-_18rem)] rounded-lg bg-background p-4'>
            {posts
              .filter((post) => post.archived)
              .map((post) => (
                <>
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    subtitle={post.subtitle}
                    content={post.content}
                    hashtags={post.hashtags}
                    expireDate={post.expireDate}
                    cities={post.cities}
                    categories={post.categories}
                    gallery={post.gallery}
                    archived={post.archived}
                  />
                  <Separator className='my-4' />
                </>
              ))}
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
