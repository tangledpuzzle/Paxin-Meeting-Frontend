import React from 'react';

import { VisibilityContext } from 'react-horizontal-scrolling-menu';

export function CardSlide({
  itemId,
  selected,
  width,
  onClick,
  title,
  margin,
}: {
  itemId: string;
  selected: boolean;
  onClick: Function;
  width: string;
  title: string;
  margin: string;
}) {
  const visibility = React.useContext(VisibilityContext);

  const visible = visibility.isItemVisible(itemId);

  return (
    <div
      onClick={() => onClick()}
      role='button'
      style={{
        border: '0px solid',
        display: 'inline-block',
        margin: '0 10px',
        textAlign: 'center',
        width,
        marginLeft: margin,
        marginRight: margin,
        userSelect: 'none',
      }}
      tabIndex={0}
      className=' border-gradient'
    >
      <div>
        <div className='overflow-hidden text-ellipsis whitespace-nowrap px-4 text-base'>
          # {title}
        </div>
        {/* <div style={{ backgroundColor: visible ? "transparent" : "gray" }}>
          visible: {JSON.stringify(visible)}
        </div> */}
        {/* <div>selected: {JSON.stringify(!!selected)}</div> */}
      </div>
      <div
        style={{
          backgroundColor: selected ? 'green' : 'bisque',
        }}
      />
    </div>
  );
}
