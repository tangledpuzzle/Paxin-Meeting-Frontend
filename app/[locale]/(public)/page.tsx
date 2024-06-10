// import AboutSection from '@/components/main/about';
import FeatureSection from '@/components/main/feature';
import HeroSection from '@/components/main/hero';
import JoinUsSection from '@/components/main/joinus';
import NavigateSection from '@/components/main/navigate';
import ServicesSection from '@/components/main/services';
// import TestimonialSection from '@/components/main/testimonial';
import ServiceList from '@/components/main/servicelist';

import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

import '@/styles/main.css';
import Link from 'next/link';
import { headers } from 'next/headers';
import FlowSection from '@/components/main/flow';

const DynamicComponentWithSSR = dynamic(() => import('@/components/ui/price'), {
  ssr: true,
});

const ProfilesComponentWithSSR = dynamic(
  () => import('@/components/ui/profiles'),
  { ssr: true }
);

// const RatingSSR = dynamic(
//   () => import('@/components/rating'),
//   { ssr: true }
// );

const ProfilestagsWithSSR = dynamic(() => import('@/components/ui/tags'), {
  ssr: true,
});

const DynamicLiAds = dynamic(() => import('@/components/main/tt'), {
  ssr: true,
});

async function getProfilePhotos() {
  let profilePhotos = [];

  try {
    const res = await fetch(`${process.env.API_URL}/api/profiles/get`);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    for (const profile of data.data) {
      let avatar =
        profile.photos?.length > 0 && profile.photos[0].files?.length > 0
          ? `https://proxy.myru.online/150/https://img.myru.online/${profile.photos[0].files[0].path}`
          : '';

      if (avatar) {
        profilePhotos.push({
          id: profile.User.Name,
          src: avatar,
        });
      }
    }
  } catch (error) {}

  return profilePhotos;
}

async function getCategories(locale: string) {
  let categories = [];

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/guilds/getAll?limit=12`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    for (const item of data.data) {
      let category = item.Translations?.find(
        (c: any) => c.Language === locale
      )?.Name;

      if (category) {
        categories.push(category);
      }
    }
  } catch (error) {}

  return categories;
}

function extractUsername(host: string): string {
  if (process.env.NODE_ENV === 'production') {
    return host.split('.').slice(-2).join('.');
  } else {
    return host.split('.localhost')[0];
  }
}

async function getUUID(username: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/domains/get?domain=${username}`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.data?.user_id || null;
  } catch (error) {
    return null;
  }
}

export default async function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const headerList = headers();
  const uuid = await getUUID(extractUsername(headerList.get('host') || ''));

  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('main');

  const profilePhotos = await getProfilePhotos();
  const categories = await getCategories(params.locale);

  return uuid ? (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <FlowSection uuid={uuid} />
    </section>
  ) : (
    <section className='container grid items-center gap-0 px-0 pb-8'>
      <HeroSection />
      <ServicesSection />
      <NavigateSection />
      <FeatureSection />
      <ProfilesComponentWithSSR images={profilePhotos} />
      <ServiceList />
      {/* <RatingSSR /> */}
      {/* <TestimonialSection /> */}
      {/* <AboutSection /> */}
      <DynamicLiAds tags={categories} />

      {/* <DynamicComponentWithSSR /> */}
      {/* <ProfilestagsWithSSR /> */}

      <JoinUsSection />
      <div>
        <Link href='/home' className='cta'>
          <span className='icon'>
            <svg
              viewBox='0 0 140 151'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='currentColor'
                d='M96.946 21.349c-1.877-7.405-7.11-10.12-14.25-11.313C76.61 9.029 78.524-.307 85.552.934c12.145 2.138 19.256 9.323 21.332 21.553 1.134 6.686-7.734 8.925-9.081 2.555a97.122 97.122 0 0 0-.856-3.693Z'
              />
              <path
                fill='currentColor'
                d='M106.297 47.751c.434.43.645.34.632-.27-.13-8.307 2.826-13.906 8.868-16.797 4.833-2.319 9.698-2.353 14.593-.102 7.557 3.478 9.212 10.501 9.128 18.633-.124 12.64-.13 25.735-.018 39.283.062 7.877-.347 14.005-1.227 18.382-4.323 21.403-20.394 37.538-41.67 41.986-18.451 3.852-36.521-2.005-49.915-15.509a10476.058 10476.058 0 0 1-34.876-35.3c-8.672-8.823-5.568-21.926 5.41-26.71a.392.392 0 0 0 .111-.644c-5.14-4.766-8.226-10.1-6.739-17.272 1.209-5.844 4.763-9.867 10.662-12.068.409-.15.52-.423.335-.82-2.278-4.897-1.794-11.743 1.282-16.098 4.323-6.118 13.013-9.4 20.152-5.67a.585.585 0 0 0 .818-.308c.824-2.25 2.141-4.256 3.95-6.015 5.293-5.149 11.164-6.426 17.615-3.834 2.237.896 4.787 2.798 7.65 5.708a6099.026 6099.026 0 0 0 33.239 33.425ZM90.18 70.964c-.044.05-.087.094-.13.13-2.281 1.972-4.434 1.94-6.46-.092-14.16-14.176-27.78-27.82-40.862-40.933-1.24-1.25-2.436-2.176-3.588-2.78-1.525-.808-3.173-.904-4.945-.289-1.958.678-3.34 1.95-4.146 3.815-1.252 2.891-.47 5.776 2.343 8.655a3001.644 3001.644 0 0 0 39.94 40.046c1.271 1.25 2.092 2.422 2.464 3.516.607 1.791.217 3.352-1.171 4.682-1.339 1.293-2.919 1.61-4.74.951a6.11 6.11 0 0 1-2.25-1.445 10432.312 10432.312 0 0 1-34.262-34.684c-1.047-1.057-2.222-1.81-3.523-2.257-2.609-.89-4.951-.376-7.027 1.538-2.15 1.984-2.767 4.269-1.85 6.855.459 1.275 1.326 2.565 2.603 3.87A3357.32 3357.32 0 0 0 57.275 97.46c.508.504.91 1.129 1.208 1.875.477 1.187.428 2.393-.149 3.618-.737 1.561-1.964 2.422-3.68 2.584-1.587.149-2.938-.348-4.053-1.493a4644.71 4644.71 0 0 0-20.98-21.385c-1.164-1.18-2.413-2.076-3.745-2.686-2.008-.926-4.056-.783-6.144.43-1.246.72-2.17 1.78-2.77 3.18-.707 1.647-.775 3.239-.205 4.775.527 1.405 1.342 2.667 2.445 3.786a10118.855 10118.855 0 0 1 33.267 33.929c9.934 10.166 21.4 15.015 34.402 14.549 12.157-.435 22.429-4.983 30.813-13.644 4.195-4.334 7.318-9.255 9.369-14.764 2.064-5.533 3.096-11.294 3.096-17.281 0-15.364.009-31.594.028-48.693a10.314 10.314 0 0 0-.632-3.562c-.595-1.654-1.68-2.863-3.254-3.628-2.076-1.001-4.142-1.001-6.2 0-1.555.752-2.649 1.958-3.281 3.619-.409 1.063-.607 2.306-.595 3.73.037 4.14.028 8.319-.028 12.535-.018 1.032-.238 1.936-.66 2.713-.687 1.269-1.778 2.093-3.271 2.472-.775.193-1.54.14-2.296-.159-.583-.23-1.066-.538-1.45-.923a14375.868 14375.868 0 0 1-43.725-43.815c-1.047-1.057-2.262-1.787-3.643-2.191-2.647-.777-4.961-.106-6.944 2.014-1.208 1.3-1.79 2.83-1.748 4.589.056 2.002.794 3.72 2.213 5.157a6307.528 6307.528 0 0 0 35.359 35.533c2.156 2.151 2.209 4.365.157 6.64ZM21.005 135.978C9.628 134.056 2.061 126.53.119 114.798c-.236-1.437-.121-2.708.344-3.815 1.329-3.133 5.437-3.749 7.64-1.063.725.87 1.184 1.965 1.376 3.283 1.143 7.871 6.07 12.581 13.71 13.514 2.482.307 4.843 2.098 4.666 4.803-.25 3.795-3.43 5.036-6.85 4.458Z'
              />
            </svg>
          </span>
          <span className='text2'>
            <span>{t('flow')}</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
