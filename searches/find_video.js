const { BASE_URL } = require('../constants');

module.exports = {
  key: 'find_video',
  noun: 'Video',
  display: { label: 'Find Video', description: 'Finds a video by its ID and shows its processing status.' },
  operation: {
    inputFields: [{ key: 'video_id', label: 'Video ID', required: true }],
    perform: async (z, bundle) => {
      const response = await z.request({ url: `${BASE_URL}/videos/${encodeURIComponent(bundle.inputData.video_id)}` });
      return [{ ...response.data, id: response.data.video_id }];
    },
    sample: { id: '9f3c2a71', video_id: '9f3c2a71', title: 'Episode 41', status: 'done', progress_percent: 100, clips_ready: 5, url: 'https://snapdub.ai/videos/9f3c2a71' },
  },
};
