import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('privacy');
  const faqs = [
    {
      id: 1,
      question: 'agreement',
      answer: 'weCollect',
    },
    {
      id: 2,
      question: 'useInfo',
      answer: 'weUse',
    },
    {
      id: 3,
      question: 'dataProt',
      answer: 'dataProtInfo',
    },
    {
      id: 4,
      question: 'provideInfo',
      answer: 'provideInfoDesc',
    },
    {
      id: 5,
      question: 'cookieInfo',
      answer: 'cookieInfoDesc',
    },
    {
      id: 6,
      question: 'privacyChange',
      answer: 'privacyChangeDesc',
    },
    {
      id: 7,
      question: 'userCons',
      answer: 'userConsDesc',
    },
    {
      id: 8,
      question: 'contRules',
      answer: 'contRulesDesc',
    },
    // More questions...
  ];

  return (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='h-full'>
        <div className='mx-auto max-w-7xl divide-y divide-gray-200 px-0 py-12 sm:px-0 lg:px-0 lg:py-16'>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            {t('rulesprivacy')}
          </h2>
          <div className='mt-8'>
            <dl className='divide-y divide-gray-200'>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className='pb-8 pt-6 md:grid md:grid-cols-12 md:gap-8'
                >
                  <dt className='text-base font-semibold text-gray-900 dark:text-white md:col-span-5'>
                    {t(faq.question as keyof IntlMessages['privacy'])}
                  </dt>
                  <dd className='mt-2 md:col-span-7 md:mt-0'>
                    <p className='text-base text-gray-900 dark:text-white'>
                      {t(faq.answer as keyof IntlMessages['privacy'])}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
