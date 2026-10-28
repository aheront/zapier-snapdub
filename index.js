const authentication = require('./authentication');
const { befores, afters } = require('./middleware');
const clipsReady = require('./triggers/clips_ready');
const videoFailed = require('./triggers/video_failed');
const templateList = require('./triggers/template_list');
const createClips = require('./creates/create_clips');
const schedulePost = require('./creates/schedule_post');
const findVideo = require('./searches/find_video');
const findClips = require('./searches/find_clips');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,
  beforeRequest: befores,
  afterResponse: afters,

  triggers: {
    [clipsReady.key]: clipsReady,
    [videoFailed.key]: videoFailed,
    [templateList.key]: templateList,
  },
  creates: {
    [createClips.key]: createClips,
    [schedulePost.key]: schedulePost,
  },
  searches: {
    [findVideo.key]: findVideo,
    [findClips.key]: findClips,
  },
  searchOrCreates: {},
};
