interface Props {
  viewerName: string;
}

export default function WatchingAsBar({ viewerName }: Props) {
  return (
    <div className='bg-indigo-100 py-2 text-center text-xs text-indigo-500 dark:bg-indigo-900 dark:text-indigo-400'>
      Watching as <span className='font-bold'>{viewerName}</span>
    </div>
  );
}
