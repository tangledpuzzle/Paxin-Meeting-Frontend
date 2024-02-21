import CryptoJS from 'crypto-js';
import axios, { ResponseType } from 'axios';
import toast from 'react-hot-toast';
import { generateRandomString, hashTimestamp } from '@/lib/utils';
import { CommonResponse } from '../proto/plugnmeet_common_api_pb';
import { getAccessToken } from '../utils';

type MODE = 'join' | 'create';

const sendRequest = async (
  body: { room_id: any; user_info?: any },
  method: string
) => {
  const b = JSON.stringify(body);
  const hash = CryptoJS.HmacSHA256(
    b,
    process.env.NEXT_PUBLIC_PAXMEET_API_SECRET || ''
  );
  const signature = CryptoJS.enc.Hex.stringify(hash);

  let headers = {
    'Content-Type': 'application/json',
    'API-KEY': process.env.NEXT_PUBLIC_PAXMEET_API_KEY,
    'HASH-SIGNATURE': signature,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL + '/auth/' + method,
    {
      method: 'POST',
      //@ts-ignore
      headers: headers,
      body: b,
    }
  );

  if (response.status !== 200) {
    console.log(response.json());
    return;
  }

  return await response.json();
};

const processRequest = async (mode: MODE, roomInfo: any, userInfo: any) => {
  let flag = false;

  if (mode === 'create') {
    let isRoomActive = false;
    const res = await sendRequest(
      {
        room_id: roomInfo.room_id,
      },
      'room/isRoomActive'
    );
    isRoomActive = res.status;
    if (isRoomActive) {
      toast.error('A room with the same ID already exists!');
    } else {
      const roomCreateRes = await sendRequest(roomInfo, 'room/create');
      isRoomActive = roomCreateRes.status;
      if (isRoomActive) {
        flag = true;
      }
    }
  } else if (mode === 'join') {
    let isRoomActive = false;
    const res = await sendRequest(
      {
        room_id: roomInfo.room_id,
      },
      'room/isRoomActive'
    );
    isRoomActive = res.status;
    if (!isRoomActive) {
      toast.error('There is no room with that ID!');
    } else {
      flag = true;
    }
  }

  if (flag) {
    const getJoinTokenReq = {
      room_id: roomInfo.room_id,
      user_info: userInfo,
    };

    const roomCreateRes = await sendRequest(
      getJoinTokenReq,
      'room/getJoinToken'
    );

    if (roomCreateRes.status) {
      console.log('[Conf] Token = ' + roomCreateRes.token);
      return roomCreateRes.token;
    } else {
      console.log(roomCreateRes.msg);
      toast.error("Can't get token");
    }
  }
};

export const createRoomId = (feed: string): string => {
  const randomPart = generateRandomString(4);
  const timestampHash = hashTimestamp(Date.now());
  const roomId = `${feed}-${randomPart}-${timestampHash}`;
  return roomId;
}

export const createRoom = async (roomId: string, userId: string, userName: string): Promise<string> => {
  const roomInfo = {
    // room_id: data.get('room_id'),
    room_id: roomId,
    creator: userId,
    empty_timeout: 60 * 60 * 2,
    metadata: {
      room_title: 'Pax Real-Time Meeting',
      welcome_message:
        'Welcome to PaxMeet!<br /> To share microphone click mic icon from bottom left side.',
      //webhook_url: "http://example.com",
      //logout_url: "http://example.com",
      room_features: {
        allow_webcams: true,
        mute_on_start: false,
        allow_screen_share: true,
        allow_rtmp: true,
        admin_only_webcams: false,
        allow_view_other_webcams: true,
        allow_view_other_users_list: true,
        allow_polls: true,
        room_duration: 0,
        enable_analytics: true,
        recording_features: {
          is_allow: true,
          is_allow_cloud: true,
          is_allow_local: true,
          enable_auto_cloud_recording: false,
          only_record_admin_webcams: false,
        },
        chat_features: {
          allow_chat: true,
          allow_file_upload: true,
          max_file_size: 50,
          allowed_file_types: ['jpg', 'png', 'zip'],
        },
        shared_note_pad_features: {
          allowed_shared_note_pad: true,
        },
        whiteboard_features: {
          allowed_whiteboard: true,
        },
        external_media_player_features: {
          allowed_external_media_player: true,
        },
        waiting_room_features: {
          is_active: true,
        },
        breakout_room_features: {
          is_allow: true,
          allowed_number_rooms: 6,
        },
        display_external_link_features: {
          is_allow: true,
        },
        ingress_features: {
          is_allow: true,
        },
        speech_to_text_translation_features: {
          is_allow: true,
          is_allow_translation: true,
        },
        // end_to_end_encryption_features: {
        //     is_enabled: true
        // }
      },
      // default_lock_settings: {
      //     lock_microphone: true,
      //     lock_screen_sharing: true,
      //     lock_webcam: true,
      //     lock_chat_file_share: true,
      //     lock_chat_send_message: true
      // }
    },
  };

  const userInfo = {
    is_admin: false,
    name: userName,
    user_id: userId,
    /*user_metadata: {
      record_webcam: false,
    }*/
  };

  const token = await processRequest('create', roomInfo, userInfo);
  return token ?? ""
}

export const joinRoom = async (roomId: string, userId: string, userName: string): Promise<string> => {
  const roomInfo = {
    room_id: roomId,
  };

  const userInfo = {
    is_admin: false,
    name: userName,
    user_id: userId,
    /*user_metadata: {
      record_webcam: false,
    }*/
  };

  const token = await processRequest('join', roomInfo, userInfo);
  return token ?? ""
}

const sendAPIRequest = async (
  path: string,
  body: any,
  json_encode = true,
  content_type = 'application/json',
  response_type: ResponseType = 'json'
) => {
  try {
    const API = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL + '/api',
    });
    
    if (json_encode) {
      body = JSON.stringify(body);
    }
    const res = await API.post(path, body, {
      headers: {
        Authorization: getAccessToken(),
        'Content-Type': content_type,
      },
      responseType: response_type,
    });
    return res.data;
  } catch (e: any) {
    console.error(e.message);
    if (!json_encode) {
      const res = new CommonResponse({
        status: false,
        msg: e.code + ': ' + e.message,
      });
      return res.toBinary();
    } else {
      return {
        status: false,
        msg: e.code + ': ' + e.message,
      };
    }
  }
};

export default sendAPIRequest;
