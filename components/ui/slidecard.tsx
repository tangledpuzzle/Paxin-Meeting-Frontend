import React from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';

export function CardSlide({
  itemId,
  selected,
  onClick,
  title,
}: {
  itemId: string;
  selected: boolean;
  onClick: () => void;
  width: string;
  title: string;
  margin: string;
}) {
  const visibility = React.useContext(VisibilityContext);

  visibility.isItemVisible(itemId);

  return (
    <div
      onClick={() => onClick()}
      role='button'
      style={{
        border: '0px solid',
        display: 'inline-block',
        margin: '0 0px',
        textAlign: 'center',
        width: '100%',
        userSelect: 'none',
      }}
      tabIndex={0}
      className='border-gradient'
    >
      <div className='mr-8'>
        <div className='truncate px-4 text-base'>
          # {title}
        </div>
      </div>
      <div
        style={{
          backgroundColor: selected ? 'green' : 'bisque',
        }}
      />
    </div>
  );
}
