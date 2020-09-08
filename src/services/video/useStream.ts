import { RefObject, useCallback, useRef } from 'react';

export interface UseStreamResponse {
  setStream: (stream: MediaStream) => void;
  videoRef: RefObject<HTMLVideoElement> | undefined;
  play: () => void;
}

const useStream = (): UseStreamResponse => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const setStream = useCallback(
    (stream: MediaStream): void => {
      if (stream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = stream;
      }
    },
    [videoRef],
  );

  const play = () => videoRef.current?.play();

  return { setStream, videoRef, play };
};

export default useStream;
