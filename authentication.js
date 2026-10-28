const { BASE_URL } = require('./constants');

// An API key from SnapDub > Settings > API keys (paid plans). Tested against GET /me, whose
// answer also names the connection in Zapier ("My workspace (Pro)").
module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Create one in SnapDub under [Settings, API keys](https://snapdub.ai/settings/api). The API comes with every paid plan.',
    },
  ],
  test: { url: `${BASE_URL}/me` },
  connectionLabel: '{{bundle.inputData.account}} ({{bundle.inputData.plan}})',
};
