/* eslint-disable no-console */
import Peer from 'peerjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { settings } from '../../config';
import { Actions } from '../socket/actions';
import { SocketMessage, useSocket } from '../socket/useSocket';

export interface RemoteStream {
  id: string;
  name?: string;
  stream: MediaStream;
}

export interface UseVideoResponse {
  remoteStreams: RemoteStream[];
  error?: Error;
}
export interface UseVideoProps {
  currentUserId?: string;
  localStream?: MediaStream;
  socket?: SocketIOClient.Socket;
}

const myPeerId = uuidv4();

const useVideo = ({
  currentUserId, // for dev purposes we use a random id
  localStream,
}: UseVideoProps): UseVideoResponse => {
  const { socket } = useSocket();
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [error, setError] = useState<Error>();

  const addRemoteStream = useCallback(({ stream, id, name }: RemoteStream) => {
    setRemoteStreams((prev) => {
      if (!stream || !id) return [...prev];
      if (prev.some((remote) => remote.id === id)) return [...prev];
      return [...prev, { id, stream, name }];
    });
  }, []);

  const removeRemoteStream = useCallback((id: string) => {
    setRemoteStreams((prev) => {
      const index = prev.findIndex((remote) => remote.id === id);
      if (index < 0) return prev;
      prev.splice(index, 1);
      return [...prev];
    });
  }, []);

  useEffect(() => {
    if (!localStream || !socket) return undefined;

    const myPeer = new Peer(myPeerId, {
      host: settings.peer.host,
      port: settings.peer.port,
    });

    const cleanUp = () => {
      if (myPeer) {
        myPeer.disconnect();
        myPeer.destroy();
      }
    };

    myPeer.on('open', (id) => {
      socket.emit(Actions.NEW_USER_VIDEO, { id });
    });

    // answer call
    myPeer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id: call.peer, name: call.metadata?.name });
      });
    });

    // connect to new user
    socket.on(Actions.USER_VIDEO_CONNECTED, (data: SocketMessage) => {
      const { peerId = '', user } = data;
      const call = myPeer.call(peerId, localStream, {
        metadata: { name: user?.name },
      });
      call.on('stream', (stream) => {
        addRemoteStream({ stream, id: peerId, name: user?.name });
      });
      call.on('close', () => {
        removeRemoteStream(peerId);
      });
    });

    // disconect from user
    socket.on(Actions.USER_DISCONNECTED, ({ peerId }: SocketMessage) => {
      if (!peerId) return;
      removeRemoteStream(peerId);
    });

    myPeer.on('disconnected', () => {
      cleanUp();
    });
    myPeer.on('close', () => {
      cleanUp();
    });
    myPeer.on('error', (error) => {
      console.error(error);
      setError(new Error(String(error)));
      cleanUp();
    });

    return () => {
      cleanUp();
    };
  }, [addRemoteStream, localStream, removeRemoteStream, socket, currentUserId]);

  const value = useMemo(() => ({ remoteStreams, error }), [
    remoteStreams,
    error,
  ]);
  return value;
};

export default useVideo;
