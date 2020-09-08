import Peer from 'peerjs';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { settings } from '../../config';
import { SocketMessage } from '../socket/useSocket';

export interface UseVideoResponse {
  peer: Peer | undefined;
  remoteStreams: RemoteStream[];
}
export interface UseVideoProps {
  currentUserId?: string;
  localStream?: MediaStream;
  socket?: SocketIOClient.Socket;
}

export interface RemoteStream {
  id: string;
  stream: MediaStream;
}

const useVideo = ({
  currentUserId,
  localStream,
  socket,
}: UseVideoProps): UseVideoResponse => {
  const [myPeer, setPeer] = useState<Peer>();
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

  const addRemoteStream = useCallback(({ stream, id }: RemoteStream) => {
    setRemoteStreams((prev) => {
      if (!stream || !id) return [...prev];
      if (prev.some((remote) => remote.id === id)) return [...prev];
      return [...prev, { id, stream }];
    });
  }, []);

  const removeRemoteStream = useCallback((id: string) => {
    setRemoteStreams((remoteStreams) => {
      const index = remoteStreams.findIndex((remote) => remote.id === id);
      if (index < 0) return [...remoteStreams];
      remoteStreams.splice(index, 1);
      return [...remoteStreams];
    });
  }, []);

  useEffect(() => {
    const peer = myPeer
      ? myPeer
      : new Peer(uuidv4(), {
          secure: false,
          host: settings.host,
          port: settings.port,
        });

       console.log(peer);

    peer.on('open', (_id) => {
      setPeer(peer);
    });

    peer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id: currentUserId as string });
      });
    });

    socket?.on('user-connected', (data: SocketMessage) => {
      if (!data?.user?.id || !localStream) return;
      const id = data.user.id;
      const call = peer.call(id, localStream);
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id });
      });
      call.on('close', () => {
        removeRemoteStream(id);
      });
    });

    socket?.on('user-disconnected', (data: SocketMessage) => {
      if (!data?.user?.id) return;
      removeRemoteStream(data.user.id);
    });

    const cleanUp = () => {
      if (myPeer) {
        myPeer.disconnect();
        myPeer.destroy();
      }
      setPeer(undefined);
    };

    peer.on('disconnected', () => {
      cleanUp();
    });

    peer.on('close', () => {
      cleanUp();
    });

    peer.on('error', (error) => {
      console.error(error);
      cleanUp();
    });

    return () => {
      cleanUp();
    };
  }, [
    addRemoteStream,
    currentUserId,
    localStream,
    myPeer,
    removeRemoteStream,
    socket,
  ]);

  return { peer: myPeer, remoteStreams };
};

export default useVideo;
