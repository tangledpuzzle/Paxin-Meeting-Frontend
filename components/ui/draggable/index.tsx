import React, { ReactNode, useContext } from 'react';
import { DraggableContext } from './context';
import SystemDraggable, {
  DraggableProps as DraggableOptions,
} from 'react-draggable';

interface DraggableProps extends DraggableOptions {
  children: ReactNode;
  header: string;
}
export default function Draggable({
  children,
  header,
  ...options
}: DraggableProps) {
  return (
    <DraggableContext.Provider value={{ header }}>
      <SystemDraggable {...options}>
        <div>{children}</div>
      </SystemDraggable>
    </DraggableContext.Provider>
  );
}
interface DraggableHeaderProps {
  children: ReactNode;
}
export function DraggableHandle({ children }: DraggableHeaderProps) {
  const { header } = useContext(DraggableContext);
  return <div className={header}>{children}</div>;
}
