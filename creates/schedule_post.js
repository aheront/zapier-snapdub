const { BASE_URL } = require('../constants');

// POST /posts: puts a finished clip on the SnapDub Content Plan for the connected accounts.
module.exports = {
  key: 'schedule_post',
  noun: 'Post',
  display: {
    label: 'Schedule Post',
    description: 'Posts a finished clip to your connected social media account, now or at a set time.',
  },
  operation: {
    inputFields: [
      { key: 'clip_id', label: 'Clip ID', required: true, helpText: 'A clip_id from New Clip Ready or Find Clips.' },
      {
        key: 'platforms',
        label: 'Platforms',
        required: true,
        list: true,
        choices: { tiktok: 'TikTok', youtube: 'YouTube', instagram: 'Instagram' },
        helpText: 'The networks must be connected in SnapDub.',
      },
      { key: 'post_at', label: 'Post At', type: 'datetime', helpText: 'Leave empty to post now.' },
    ],
    perform: async (z, bundle) => {
      const body = { clip_id: bundle.inputData.clip_id, platforms: bundle.inputData.platforms };
      if (bundle.inputData.post_at) body.post_at = bundle.inputData.post_at;
      const response = await z.request({ url: `${BASE_URL}/posts`, method: 'POST', body });
      const first = (response.data.scheduled || [])[0] || {};
      return { ...response.data, id: first.post_id || bundle.inputData.clip_id };
    },
    sample: {
      id: '812',
      scheduled: [{ post_id: '812', clip_id: 'a1b2c3d4', platform: 'tiktok', post_at: '2026-11-02T18:00:00+02:00', status: 'scheduled' }],
      skipped: [],
      plan_url: 'https://snapdub.ai/plan',
    },
  },
};
