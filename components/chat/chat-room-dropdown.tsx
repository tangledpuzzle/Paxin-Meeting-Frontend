import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaxChatContext } from '@/context/chat-context';
import unsubscribe from '@/lib/server/chat/unsubscribe';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { ConfirmModal } from '../common/confirm-modal';

export default function ChatRoomDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('chatting');
  const router = useRouter();
  const { activeRoom, setChatRooms } = useContext(PaxChatContext);
  const [isLeavingChat, setIsLeavingChat] = useState(false);

  const handleLeaveChat = async () => {
    try {
      const res = await unsubscribe(activeRoom);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const newChatRooms = chatRooms.filter(
            (_room) => _room.id !== activeRoom
          );

          return newChatRooms;
        });

        router.push('/chat');
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLeavingChat(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isLeavingChat}
        onClose={() => {
          setIsLeavingChat(false);
        }}
        title={t('leave_chat')}
        description={t('are_you_sure_leave_chat')}
        onConfirm={() => {
          handleLeaveChat();
        }}
        loading={false}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuItem
            className='cursor-pointer text-red-500 hover:!text-red-500'
            onClick={() => setIsLeavingChat(true)}
          >
            <FaTrashCan className='mr-2 size-4' />
            {t('leave_chat')}
            {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
