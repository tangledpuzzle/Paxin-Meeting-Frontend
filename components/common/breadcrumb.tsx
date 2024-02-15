import Link from 'next/link';
import { RxSlash } from 'react-icons/rx';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  contents: Array<{ name: string; url: string }>;
}

function Breadcrumb({ contents }: BreadcrumbProps) {
  return (
    <nav
      className='my-4 text-sm font-bold text-gray-400 overflow-hidden'
      aria-label='Breadcrumb'
    >
      <ol className='inline-flex list-none p-0'>
        {contents.map((content, index) => {
          return index == contents.length - 1 ? (
            <div
              className='flex items-center text-secondary-foreground text-nowrap'
              key={index}
            >
              {content.name}
            </div>
          ) : (
            <div className='flex items-center' key={index}>
              <Link href={content.url}>{content.name}</Link>
              <RxSlash className='mx-1' />
            </div>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
