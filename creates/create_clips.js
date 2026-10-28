const { BASE_URL } = require('../constants');

// POST /videos. Answers at once with the video_id; the clips take minutes, so pair this with the
// Clips Ready trigger (or Find Clips later) rather than waiting here.
module.exports = {
  key: 'create_clips',
  noun: 'Video',
  display: {
    label: 'Create Clips',
    description: 'Creates captioned vertical clips from a long video link.',
  },
  operation: {
    inputFields: [
      { key: 'url', label: 'Video URL', required: true, helpText: 'A YouTube, Twitch, Kick, Rumble or Zoom link to the long video.' },
      { key: 'clips', label: 'Number of Clips', type: 'integer', helpText: 'How many clips to make. Defaults to 6.' },
      { key: 'clip_length_seconds', label: 'Longest Clip (seconds)', type: 'integer', helpText: 'Defaults to 180.' },
      { key: 'captions', label: 'Captions', type: 'boolean', default: 'true', helpText: 'Burn captions into the clips.' },
      { key: 'template', label: 'Template', dynamic: 'template_list.id.name', helpText: 'Apply the style of one of your SnapDub templates.' },
      { key: 'translate_to', label: 'Translate Captions To', helpText: 'A language code such as "es". Leave empty to keep the original language.' },
    ],
    perform: async (z, bundle) => {
      const body = { url: bundle.inputData.url };
      ['clips', 'clip_length_seconds', 'captions', 'template', 'translate_to'].forEach((key) => {
        const value = bundle.inputData[key];
        if (value !== undefined && value !== null && value !== '') body[key] = value;
      });
      const response = await z.request({ url: `${BASE_URL}/videos`, method: 'POST', body });
      return { ...response.data, id: response.data.video_id };
    },
    sample: {
      id: '9f3c2a71',
      video_id: '9f3c2a71',
      title: 'Episode 41',
      status: 'fetching the video',
      progress_percent: 0,
      credits_spent: 412,
      credits_left: 8008,
      url: 'https://snapdub.ai/videos/9f3c2a71',
    },
  },
};
