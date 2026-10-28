const { BASE_URL } = require('../constants');

// Hidden: fills the Template dropdown of Create Clips.
module.exports = {
  key: 'template_list',
  noun: 'Template',
  display: { label: 'List Templates', description: 'Your SnapDub templates.', hidden: true },
  operation: {
    perform: async (z) => {
      const { data } = await z.request({ url: `${BASE_URL}/templates` });
      return (data.templates || []).map((template) => ({ id: template.name, name: template.name }));
    },
    sample: { id: 'Podcast clips', name: 'Podcast clips' },
  },
};
