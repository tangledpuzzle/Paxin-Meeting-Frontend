import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('rules');
  const faqs = [
    {
      id: 1,
      question: 'ilegal',
      answer: 'ilegalDesc',
    },
    {
      id: 2,
      question: 'ilegalLang',
      answer: 'ilegalLangDesc',
    },
    {
      id: 3,
      question: 'ilegalInfo',
      answer: 'ilegalInfoDesc',
    },
    {
      id: 4,
      question: 'platResp',
      answer: 'platRespDesc',
    },
    {
      id: 5,
      question: 'accBlock',
      answer: 'accBlockDesc',
    },
    // More questions...
  ];

  return (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='h-full'>
        <div className='mx-auto max-w-7xl divide-y divide-gray-200 px-0 py-12 pt-4 sm:px-0 lg:px-0 lg:py-16'>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            {t('rules')}
          </h2>
          <div className='mt-8'>
            <dl className='divide-y divide-gray-200'>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className='pb-8 pt-6 md:grid md:grid-cols-12 md:gap-8'
                >
                  <dt className='text-base font-semibold text-gray-900 dark:text-white md:col-span-5'>
                    {t(faq.question as keyof IntlMessages['rules'])}
                  </dt>
                  <dd className='mt-2 md:col-span-7 md:mt-0'>
                    <p className='text-base text-gray-900 dark:text-white'>
                      {t(faq.answer as keyof IntlMessages['rules'])}
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
