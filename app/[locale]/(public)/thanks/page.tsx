export default function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {



  return (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='h-full'>
        <div className='mx-auto max-w-7xl divide-y divide-gray-200 px-0 py-12 pt-4 sm:px-0 lg:px-0 lg:py-16'>
          <div className='mt-8'>
            <p className='text-3xl text-center'>Баланс успешно пополнен<br/>
            </p>
            <p className='text-xl text-center'>Это окно будет закрыто через ....</p>

          </div>
        </div>
      </div>
    </section>
  );
}
