import { useState } from 'react';
import { toast } from 'react-toastify';

import { IUseCloudRecordingReturn, RecordingType } from './IRecording';
import { RecordingReq } from '@/helpers/proto/plugnmeet_recording_pb';
import { RecordingTasks } from '@/helpers/proto/plugnmeet_recorder_pb';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { CommonResponse } from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';
import { Room } from 'livekit-client';

const useCloudRecording = (currentRoom: Room): IUseCloudRecordingReturn => {
  const TYPE_OF_RECORDING = RecordingType.RECORDING_TYPE_LOCAL;
  const [hasError, setHasError] = useState<boolean>(false);
  const t = useTranslations('meet');

  const startRecording = async () => {
    const sid = await currentRoom.getSid();
    const body = new RecordingReq({
      task: RecordingTasks.START_RECORDING,
      sid,
    });
    if (typeof (window as any).DESIGN_CUSTOMIZATION !== 'undefined') {
      body.customDesign = `${(window as any).DESIGN_CUSTOMIZATION}`.replace(
        /\s/g,
        ''
      );
    }
    const r = await sendAPIRequest(
      'recording',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));
    let msg = 'footer.notice.start-recording-progress';
    if (!res.status) {
      setHasError(true);
      msg = res.msg;
    }
    // @ts-ignore
    toast(t(msg), {
      toastId: 'recording-status',
      type: 'info',
    });
  };

  const stopRecording = async () => {
    const body = new RecordingReq({
      task: RecordingTasks.STOP_RECORDING,
      sid,
    });
    const r = await sendAPIRequest(
      'recording',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));
    let msg = 'footer.notice.stop-recording-service-in-progress';

    if (!res.status) {
      setHasError(true);
      msg = res.msg;
    }
    // @ts-ignore
    toast(t(msg).toString(), {
      toastId: 'recording-status',
      type: 'info',
    });
  };

  const resetError = () => {
    if (hasError) {
      setHasError(false);
    }
  };

  return {
    TYPE_OF_RECORDING,
    hasError,
    startRecording,
    stopRecording,
    resetError,
  };
};

export default useCloudRecording;
