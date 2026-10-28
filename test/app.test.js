const nock = require('nock');
const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
const API = 'https://snapdub.ai';
const authData = { apiKey: 'sd_live_test' };

afterEach(() => nock.cleanAll());

describe('authentication', () => {
  it('tests the key against /me with a Bearer header', async () => {
    nock(API, { reqheaders: { authorization: 'Bearer sd_live_test' } })
      .get('/api/v1/me')
      .reply(200, { account: 'My workspace', plan: 'Pro', credits_left: 8420 });

    const result = await appTester(App.authentication.test, { authData });
    expect(result.account).toBe('My workspace');
  });

  it("shows SnapDub's own error sentence", async () => {
    nock(API).get('/api/v1/me').reply(402, { error: 'The API comes with paid plans - this workspace is on the free plan.' });

    await expect(appTester(App.authentication.test, { authData })).rejects.toThrow('comes with paid plans');
  });
});

describe('Clips Ready trigger', () => {
  const trigger = App.triggers.clips_ready.operation;

  it('subscribes the Zap url to video.completed and unsubscribes by webhook_id', async () => {
    nock(API)
      .post('/api/v1/webhooks', { url: 'https://hooks.zapier.com/abc', events: ['video.completed'] })
      .reply(201, { webhook_id: 'wh_1', url: 'https://hooks.zapier.com/abc', events: ['video.completed'] });
    const subscribed = await appTester(trigger.performSubscribe, { authData, targetUrl: 'https://hooks.zapier.com/abc' });
    expect(subscribed.webhook_id).toBe('wh_1');

    nock(API).delete('/api/v1/webhooks/wh_1').reply(200, { webhook_id: 'wh_1', deleted: true });
    const removed = await appTester(trigger.performUnsubscribe, { authData, subscribeData: { webhook_id: 'wh_1' } });
    expect(removed.deleted).toBe(true);
  });

  it('turns a delivery into one item keyed by video_id', async () => {
    const cleanedRequest = { id: 'evt_1', event: 'video.completed', data: { video_id: 'v1', clips: [{ clip_id: 'c1' }] } };
    const items = await appTester(trigger.perform, { authData, cleanedRequest });
    expect(items).toEqual([{ id: 'v1', video_id: 'v1', clips: [{ clip_id: 'c1' }] }]);
  });

  it('ignores a delivery of another event', async () => {
    const items = await appTester(trigger.perform, { authData, cleanedRequest: { event: 'video.failed', data: { video_id: 'v1' } } });
    expect(items).toEqual([]);
  });

  it('lists recent finished videos with their clips for the Zap editor', async () => {
    nock(API).get('/api/v1/videos').reply(200, { videos: [{ video_id: 'v1', status: 'done' }, { video_id: 'v2', status: 'processing' }] });
    nock(API).get('/api/v1/videos/v1/clips').reply(200, { video_id: 'v1', clips: [{ clip_id: 'c1' }] });

    const items = await appTester(trigger.performList, { authData });
    expect(items).toEqual([{ id: 'v1', video_id: 'v1', clips: [{ clip_id: 'c1' }] }]);
  });
});

describe('actions', () => {
  it('Create Clips sends only the fields that were filled', async () => {
    nock(API)
      .post('/api/v1/videos', { url: 'https://youtu.be/x', clips: 4 })
      .reply(201, { video_id: 'v9', status: 'fetching the video' });

    const result = await appTester(App.creates.create_clips.operation.perform, {
      authData,
      inputData: { url: 'https://youtu.be/x', clips: 4, template: '' },
    });
    expect(result).toMatchObject({ id: 'v9', video_id: 'v9' });
  });

  it('Schedule Post passes platforms and returns the first post id', async () => {
    nock(API)
      .post('/api/v1/posts', { clip_id: 'c1', platforms: ['tiktok', 'youtube'] })
      .reply(200, { scheduled: [{ post_id: '812' }], skipped: [] });

    const result = await appTester(App.creates.schedule_post.operation.perform, {
      authData,
      inputData: { clip_id: 'c1', platforms: ['tiktok', 'youtube'] },
    });
    expect(result.id).toBe('812');
  });

  it('Find Clips returns every clip, best first, with the video id', async () => {
    nock(API).get('/api/v1/videos/v1/clips').reply(200, { video_id: 'v1', clips: [{ clip_id: 'c1' }, { clip_id: 'c2' }] });

    const items = await appTester(App.searches.find_clips.operation.perform, { authData, inputData: { video_id: 'v1' } });
    expect(items.map((item) => item.id)).toEqual(['c1', 'c2']);
    expect(items[0].video_id).toBe('v1');
  });
});
