# SnapDub for Zapier

SnapDub turns long videos into captioned vertical clips and posts them to social platforms. This
integration brings it into Zapier, so a new video anywhere can become finished, scheduled clips
without opening SnapDub.

## What it does

**Triggers**
- **New Clip Ready**: fires when a video finishes, with every clip, its title, score, hashtags and
  download link.
- **New Video Failed**: fires when a video could not be processed.

**Actions**
- **Create Clips**: sends a long video link (YouTube, Twitch, Kick, Rumble, Zoom) to SnapDub, with
  the number of clips, the longest clip length, captions, a template and a caption language.
- **Schedule Post**: posts a finished clip to your connected social accounts, now or at a set time.

**Searches**
- **Find Video**: looks up a video by its ID and returns its processing status.
- **Find Clips**: returns the clips of a finished video, best first.

## Example Zaps

- New YouTube upload, then Create Clips, then (on New Clip Ready) Schedule Post for the best clip.
- New Video Failed, then a Slack or email message to your team.
- New Clip Ready, then a row per clip in Google Sheets for review.

## Connecting

The integration uses a SnapDub API key. Create one under
[Settings, API keys](https://snapdub.ai/settings/api). The API comes with every paid plan. Zapier
tests the key against `GET /me` and names the connection after your workspace and plan.

All requests go to the public SnapDub API, documented at
[snapdub.ai/developers/api](https://snapdub.ai/developers/api). The two triggers are REST hooks: Zapier
subscribes a webhook when a Zap is turned on and removes it when the Zap is turned off.

## Development

Needs Node 22 or newer.

```sh
npm install
npm test                          # unit tests (jest + nock, no network)
npx zapier-platform validate      # schema and style checks
npx zapier-platform push          # upload the current version to Zapier
```

Layout:

```
index.js            app definition
authentication.js   API key auth
middleware.js       adds the key to every request, turns API errors into readable messages
triggers/           New Clip Ready, New Video Failed, the template dropdown
creates/            Create Clips, Schedule Post
searches/           Find Video, Find Clips
test/               tests
```

Trigger and action keys stay fixed between versions, because live Zaps are bound to them. Change
labels and descriptions freely, never keys.

## Support

hello@snapdub.ai

## License

MIT
