const { BASE_URL } = require('../constants');

// The clips of a finished video, best first - Zapier uses the first one unless the Zap loops.
module.exports = {
  key: 'find_clips',
  noun: 'Clip',
  display: { label: 'Find Clips', description: 'Finds the clips of a finished video.' },
  operation: {
    inputFields: [{ key: 'video_id', label: 'Video ID', required: true }],
    perform: async (z, bundle) => {
      const response = await z.request({ url: `${BASE_URL}/videos/${encodeURIComponent(bundle.inputData.video_id)}/clips` });
      return (response.data.clips || []).map((clip) => ({ ...clip, id: clip.clip_id, video_id: response.data.video_id }));
    },
    sample: {
      id: 'a1b2c3d4',
      clip_id: 'a1b2c3d4',
      video_id: '9f3c2a71',
      title: 'The 10,000 hour lie',
      virality_score: 94,
      duration_seconds: 42.0,
      description: 'Why most people quit right before it works.',
      hashtags: '#podcast #motivation',
      download_url: 'https://cdn.snapdub.ai/clips/a1b2c3d4.mp4',
    },
  },
};
