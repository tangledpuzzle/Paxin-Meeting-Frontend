import { PaxContext } from '@/context/context';
import { createRoom, createRoomId } from '@/helpers/api/paxMeetAPI';
import { setAccessToken } from '@/helpers/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon } from '@radix-ui/react-icons';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';

interface DropdownMenuDemoProps {
  children?: React.ReactNode;
  onFileUpload?: (files: File[]) => void;
  onRoomCreate?: (link: string) => void;
}

const DropdownMenuDemo = ({
  children,
  onFileUpload,
  onRoomCreate,
}: DropdownMenuDemoProps) => {
  const { user } = useContext(PaxContext);
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (!inputFileRef.current) return;

    const files = inputFileRef.current.files;

    if (files) {
      onFileUpload && onFileUpload(Array.from(files));
    }

    inputFileRef.current.value = '';
  };

  const handleFileUploadClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const onCreateRoom = async () => {
    if (!user) return;

    const roomId = createRoomId(Math.random().toString(36).substring(2, 7));
    const token = await createRoom(roomId, user.id, user.username);

    if (token) {
      toast.success('Новая комната создана.', {
        position: 'top-right',
      });

      setAccessToken(token);

      onRoomCreate &&
        onRoomCreate(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/meet/${roomId}`);
      console.log(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/meet/${roomId}`);
    } else {
      toast.error('Failed to create room. Please try again', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <input
        type='file'
        className='hidden'
        ref={inputFileRef}
        multiple
        onChange={handleFileUpload}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='DropdownMenuContent relative z-10 bg-card-gradient-menu'
            sideOffset={5}
          >
       
            <DropdownMenu.Separator className='DropdownMenuSeparator' />

            <DropdownMenu.Item
              className='DropdownMenuItem'
              onClick={onCreateRoom}
            >
              Пригласить в конференцию
            </DropdownMenu.Item>
            <DropdownMenu.RadioGroup
              value={person}
              onValueChange={setPerson}
            ></DropdownMenu.RadioGroup>

            <DropdownMenu.Arrow className='DropdownMenuArrow' />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default DropdownMenuDemo;
