import { ReactElement } from 'react';
import Draggable from 'react-draggable';
interface Props {
  children: ReactElement;
}
const DraggableBox = ({ children }: Props) => {
  return (
    <Draggable
      axis='both'
      handle='.handle'
      defaultPosition={{ x: 0, y: 0 }}
      //   position={null}
      grid={[25, 25]}
      scale={1}
    >
      <div className='absolute z-50 bg-slate-400'>
        <div className='handle'>Drag from here</div>
        <div className=''>{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableBox;
