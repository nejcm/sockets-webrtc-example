import { useEffect, useState } from 'react';
import { settings } from '../../config';

const useUserMedia = (): MediaStream | undefined => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          settings.userMedia.settings,
        );
        setMediaStream(stream);
      } catch (error) {
        console.error(error);
      }
    };
    if (!mediaStream) enableStream();

    return () => {
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [mediaStream]);

  return mediaStream;
};

export default useUserMedia;
