const { BASE_URL } = require('../constants');
const { makeHookTrigger } = require('./video_hook');

// The newest finished videos with their clips, for the Zap editor's test step.
const performList = async (z) => {
  const { data } = await z.request({ url: `${BASE_URL}/videos` });
  const done = (data.videos || []).filter((video) => video.status === 'done').slice(0, 3);
  const withClips = await Promise.all(
    done.map(async (video) => {
      const clips = await z.request({ url: `${BASE_URL}/videos/${video.video_id}/clips` });
      return { ...clips.data, id: video.video_id };
    }),
  );
  return withClips;
};

module.exports = makeHookTrigger({
  key: 'clips_ready',
  noun: 'Video',
  label: 'New Clip Ready',
  description: 'Triggers when a video finishes and its clips are ready.',
  event: 'video.completed',
  performList,
  sample: {
    id: '9f3c2a71',
    video_id: '9f3c2a71',
    title: 'Episode 41',
    status: 'done',
    clips_ready: 1,
    url: 'https://snapdub.ai/videos/9f3c2a71',
    clips: [
      {
        clip_id: 'a1b2c3d4',
        title: 'The 10,000 hour lie',
        virality_score: 94,
        duration_seconds: 42.0,
        description: 'Why most people quit right before it works.',
        hashtags: '#podcast #motivation',
        download_url: 'https://cdn.snapdub.ai/clips/a1b2c3d4.mp4',
        thumbnail_url: 'https://cdn.snapdub.ai/clips/a1b2c3d4.jpg',
      },
    ],
  },
});
