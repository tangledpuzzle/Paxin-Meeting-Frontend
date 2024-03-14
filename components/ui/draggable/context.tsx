import { createContext } from 'react';
interface IDraggableContext {
  header: string;
}
export const DraggableContext = createContext<IDraggableContext>({
  header: '',
});
