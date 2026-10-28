const { BASE_URL } = require('../constants');
const { makeHookTrigger } = require('./video_hook');

const performList = async (z) => {
  const { data } = await z.request({ url: `${BASE_URL}/videos` });
  return (data.videos || [])
    .filter((video) => video.status === 'failed')
    .slice(0, 3)
    .map((video) => ({ ...video, id: video.video_id }));
};

module.exports = makeHookTrigger({
  key: 'video_failed',
  noun: 'Video',
  label: 'New Video Failed',
  description: 'Triggers when a video could not be processed.',
  event: 'video.failed',
  performList,
  sample: {
    id: '9f3c2a71',
    video_id: '9f3c2a71',
    title: 'Episode 41',
    status: 'failed',
    error: 'The video is private.',
    url: 'https://snapdub.ai/videos/9f3c2a71',
  },
});
