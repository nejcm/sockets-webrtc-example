import Peer from 'peerjs';
import { useCallback, useEffect, useState } from 'react';
import { settings } from '../../config';
import { Actions } from '../socket/actions';
import { SocketMessage, useSocket } from '../socket/useSocket';

export interface RemoteStream {
  id: string;
  stream: MediaStream;
}

export interface UseVideoResponse {
  peer: Peer | undefined;
  remoteStreams: RemoteStream[];
}
export interface UseVideoProps {
  currentUserId?: string;
  localStream?: MediaStream;
  socket?: SocketIOClient.Socket;
}

const useVideo = ({
  currentUserId,
  localStream,
}: UseVideoProps): UseVideoResponse => {
  const { socket } = useSocket();
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
    setRemoteStreams((prev) => {
      const index = prev.findIndex((remote) => remote.id === id);
      if (index < 0) return [...prev];
      prev.splice(index, 1);
      return [...prev];
    });
  }, []);

  console.count('counter');

  useEffect(() => {
    const cleanUp = () => {
      if (myPeer) {
        myPeer.disconnect();
        myPeer.destroy();
      }
      setPeer(undefined);
    };

    const peer = myPeer
      ? myPeer
      : new Peer(currentUserId, {
          host: settings.peer.host,
          port: settings.peer.port,
        });

    peer.on('open', () => {
      setPeer(peer);
    });

    // answer call
    peer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id: call.peer });
      });
    });

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
  }, [addRemoteStream, currentUserId, localStream, myPeer]);

  useEffect(() => {
    if (!localStream || !socket || !myPeer) return;

    socket?.on(Actions.USER_CONNECTED, (data: SocketMessage) => {
      if (!data?.user?.id || !localStream) return;
      const id = data.user.id;
      const call = myPeer.call(id, localStream);
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id });
      });
      call.on('close', () => {
        removeRemoteStream(id);
      });
    });

    socket?.on(Actions.USER_DISCONNECTED, (data: SocketMessage) => {
      if (!data?.user?.id) return;
      removeRemoteStream(data.user.id);
    });
  }, [socket, localStream, myPeer, addRemoteStream, removeRemoteStream]);

  return { peer: myPeer, remoteStreams };
};

export default useVideo;
