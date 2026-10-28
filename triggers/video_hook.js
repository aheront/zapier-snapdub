const { BASE_URL } = require('../constants');

// One REST Hook trigger per SnapDub webhook event. Switching a Zap on subscribes its own URL with
// POST /webhooks (SnapDub signs and retries deliveries); switching it off deletes that subscription.
// The delivery body is {id, event, created_at, data} - the Zap gets `data`, the same JSON as the API.
const makeHookTrigger = ({ key, noun, label, description, event, sample, performList }) => ({
  key,
  noun,
  display: { label, description },
  operation: {
    type: 'hook',

    performSubscribe: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/webhooks`,
        method: 'POST',
        body: { url: bundle.targetUrl, events: [event] },
      });
      return response.data; // {webhook_id, ...} - kept by Zapier as bundle.subscribeData
    },

    performUnsubscribe: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/webhooks/${bundle.subscribeData.webhook_id}`,
        method: 'DELETE',
      });
      return response.data;
    },

    perform: (z, bundle) => {
      const delivery = bundle.cleanedRequest || {};
      if (delivery.event && delivery.event !== event) return [];
      const data = delivery.data || delivery;
      return [{ ...data, id: data.video_id }];
    },

    // What Zapier shows while setting up the Zap ("test trigger"): recent videos of this kind.
    performList,

    sample,
  },
});

module.exports = { makeHookTrigger };
