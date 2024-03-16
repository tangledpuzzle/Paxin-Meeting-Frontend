import '@/styles/loader.css';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
const Loader = () => {
  return (
    <div className='loader-background'>
      <div className='loader-ring'>
        <div className='loader-ring-light'></div>
        <div className='loader-ring-track'></div>
      </div>
    </div>
  );
};

export default Loader;
