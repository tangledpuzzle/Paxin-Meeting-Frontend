'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-unresolved
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

import UploadFilesUI from './uploadFilesUI';
import { IWhiteboardOfficeFile } from '@/store/slices/interfaces/whiteboard';
import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { sleep } from '@/helpers/utils';
// import { broadcastWhiteboardOfficeFile } from './helpers/handleRequestedWhiteboardData';
import { updateCurrentWhiteboardOfficeFileId } from '@/store/slices/whiteboard';
import { formatStorageKey } from './helpers/utils';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
const broadcastWhiteboardOfficeFile = dynamic(
  //@ts-expect-error: no sms
  async () =>
    (await import('./helpers/handleRequestedWhiteboardData'))
      .broadcastWhiteboardOfficeFile,
  {
    ssr: false,
  }
);
interface IManageFilesProps {
  excalidrawAPI: ExcalidrawImperativeAPI;
}

const currentPageSelector = createSelector(
  (state: RootState) => state.whiteboard,
  (whiteboard) => whiteboard.currentPage
);
const whiteboardUploadedOfficeFilesSelector = createSelector(
  (state: RootState) => state.whiteboard,
  (whiteboard) => whiteboard.whiteboardUploadedOfficeFiles
);

const ManageFiles = ({ excalidrawAPI }: IManageFilesProps) => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();

  const currentPage = useAppSelector(currentPageSelector);
  const whiteboardUploadedOfficeFiles = useAppSelector(
    whiteboardUploadedOfficeFilesSelector
  );
  const [refreshFileBrowser, setRefreshFileBrowser] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<JSX.Element[]>([]);
  const [fileType, setFileType] = useState<Array<string>>([]);

  useEffect(() => {
    const elms = whiteboardUploadedOfficeFiles.map((f) => {
      return (
        <div
          role='none'
          className='border-b border-solid border-primaryColor/10 last:border-none'
          key={f.fileId}
        >
          <Menu.Item>
            <button
              className='flex !w-full items-center !rounded !bg-transparent !px-3 !py-[0.4rem] !text-[10px] text-gray-700 transition ease-in hover:!bg-primaryColor hover:text-white dark:text-darkText lg:!text-xs'
              onClick={() => switchOfficeFile(f)}
            >
              {f.fileName}
            </button>
          </Menu.Item>
        </div>
      );
    });
    setMenuItems(elms);
    //eslint-disable-next-line
  }, [whiteboardUploadedOfficeFiles]);

  const openFileBrowser = (type: string) => {
    let fileType = ['jpg', 'jpeg', 'png', 'svg'];
    if (type === 'office') {
      // prettier-ignore
      fileType = ['pdf', 'docx', 'doc', 'odt', 'txt', 'rtf', 'xml', 'xlsx', 'xls', 'ods', 'csv', 'pptx', 'ppt', 'odp', 'vsd', 'odg', 'html']
    }
    setRefreshFileBrowser(refreshFileBrowser + 1);
    setFileType([...fileType]);
  };

  const switchOfficeFile = async (f: IWhiteboardOfficeFile) => {
    await saveCurrentPageData();
    dispatch(updateCurrentWhiteboardOfficeFileId(f.fileId));
    await sleep(500);
    //@ts-expect-error: no sms
    broadcastWhiteboardOfficeFile(t, f);
  };

  const saveCurrentPageData = async () => {
    if (!excalidrawAPI) {
      return;
    }
    const elms = excalidrawAPI.getSceneElementsIncludingDeleted();
    if (elms.length) {
      const currentPageNumber = store.getState().whiteboard.currentPage;
      sessionStorage.setItem(
        formatStorageKey(currentPageNumber),
        JSON.stringify(elms)
      );
    }
  };

  const render = () => {
    return (
      <>
        <button
          className='max-w flex h-[30px] cursor-pointer items-center justify-center rounded-lg border border-solid border-[#3d3d3d] !px-2 text-xs font-semibold text-[#3d3d3d] hover:bg-[#3d3d3d] hover:text-[#b8b8b8] dark:bg-[#262627] dark:text-[#b8b8b8] dark:hover:bg-[#3d3d3d] lg:h-[32px]'
          onClick={() => openFileBrowser('image')}
        >
          <i className='pnm-blank-img text-[14px] ltr:mr-1 rtl:ml-1' />
          {t('whiteboard.upload-image')}
        </button>
        <div className='menu relative z-10'>
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className='manage-icon max-w flex h-[30px] cursor-pointer items-center justify-center rounded-lg border border-solid border-[#3d3d3d] !px-2 text-xs font-semibold text-[#3d3d3d] hover:bg-[#3d3d3d] hover:text-[#b8b8b8] dark:bg-[#262627] dark:text-[#b8b8b8] dark:hover:bg-[#3d3d3d] lg:h-[32px]'>
                  <>
                    <i className='pnm-attachment text-[14px] ltr:mr-1 rtl:ml-1' />
                    {t('whiteboard.manage-files')}
                  </>
                </Menu.Button>

                {/* Use the Transition component. */}
                <Transition
                  show={open}
                  enter='transition duration-100 ease-out'
                  enterFrom='transform scale-95 opacity-0'
                  enterTo='transform scale-100 opacity-100'
                  leave='transition duration-75 ease-out'
                  leaveFrom='transform scale-100 opacity-100'
                  leaveTo='transform scale-95 opacity-0'
                >
                  {/* Mark this component as `static` */}
                  <Menu.Items
                    static
                    className='ring-opacity/5 absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:divide-secondaryColor dark:bg-darkPrimary dark:ring-secondaryColor ltr:right-0 rtl:left-0'
                  >
                    <div className='item-wrapper-uploaded-file scrollBar scrollBar2 max-h-[170px] overflow-y-auto overflow-x-hidden'>
                      {menuItems}
                    </div>
                    <div className='!mt-2 !border-t-2 border-solid !border-primaryColor py-3'>
                      <Menu.Item>
                        <button
                          onClick={() => openFileBrowser('office')}
                          className='!m-auto flex h-7 w-[100px] items-center justify-center !bg-primaryColor text-xs text-white hover:!bg-secondaryColor'
                        >
                          <i className='pnm-attachment text-[14px] text-white opacity-50 ltr:mr-1 rtl:ml-1' />
                          {t('whiteboard.upload-file')}
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
        <UploadFilesUI
          refreshFileBrowser={refreshFileBrowser}
          allowedFileTypes={fileType}
          currentPage={currentPage}
          excalidrawAPI={excalidrawAPI}
        />
      </>
    );
  };

  return render();
};

export default ManageFiles;
