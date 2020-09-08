import Peer, { MediaConnection } from 'peerjs';
import { useEffect, useState } from 'react';
import { settings } from '../../config';

const MEDIA_SETTINGS = {
  video: true,
  audio: true,
};

export interface PeersObject {
  [key: string]: MediaConnection | undefined;
}

export interface useVideoResponse {
  me: Peer | undefined;
  peers: PeersObject;
  addStream: (video: HTMLVideoElement, stream: MediaStream) => void;
}

export const useVideo = (
  socket: SocketIOClient.Socket | undefined,
): useVideoResponse => {
  // TODO: convert to useReducer
  const [me] = useState<Peer>();
  const [peers, setPeers] = useState<PeersObject>({});

  /* const addPeer = (id: string, call: MediaConnection): void => {
    setPeers((peers) => {
      const updated = { ...peers };
      updated[id] = call;
      return updated;
    });
  }; */

  const connectToStream = (userId: string, stream: MediaStream) => {
    const call = me?.call(userId, stream);
    const video = document.createElement('video');
    call?.on('stream', (userVideoStream) => {
      addStream(video, userVideoStream);
    });
    call?.on('close', () => video.remove());
  };

  useEffect(() => {
    const myPeer = new Peer(undefined, {
      host: settings.host,
      port: settings.port,
    });

    navigator.mediaDevices.getUserMedia(MEDIA_SETTINGS).then((stream) => {
      // me
      addStream(document.createElement('video'), stream);

      myPeer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
          video.srcObject = userVideoStream;
          video.addEventListener('loadedmetadata', () => {
            video.play();
          });
        });
      });

      socket?.on('user-connected', (userId: string) => {
        connectToStream(userId, stream);
      });
    });

    socket?.on('user-disconnected', (userId: string) => {
      if (!peers[userId]) return;
      peers[userId]?.close();
      setPeers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    myPeer.on('open', (id) => {
      socket?.emit('new-stream', id);
    });

    return () => {
      // cleanup
    };
  }, []);

  const addStream = (video: HTMLVideoElement, stream: MediaStream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  };

  return { me, peers, addStream };
};
