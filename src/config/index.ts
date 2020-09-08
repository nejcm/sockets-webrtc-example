export const settings = {
  host: 'http://localhost',
  port: 3001,
  basename: '',
  userMedia: {
    settings: {
      audio: { echoCancellation: true, noiseSuppression: true },
      video: { facingMode: 'user' },
    },
    ratios: new Map([
      ['default', { width: 640, height: 480 }],
      ['hd', { width: 1280, height: 960 }],
      ['portrait', { width: 375, height: 720 }],
    ]),
  },
};
