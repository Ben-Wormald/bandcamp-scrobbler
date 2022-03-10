# Bandcamp Scrobbler

A browser extension for scrobbling to Last.fm from a Bandcamp album page.
Available for [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/bandcamp-scrobbler/) and [Chrome](https://chrome.google.com/webstore/detail/bandcamp-scrobbler/cnmjkkjnmdhhemfbokmblfioalnbnlej).

Open the extension on any Bandcamp album page.
You can adjust the album details before scrobbling, and clear the title of any tracks you want to skip.

## Development

To compile the extension yourself, you'll need to provide keys for your own [Last.fm API app](https://www.last.fm/api/intro):

```bash
export API_KEY=xxx
export SECRET_KEY=xxx

npm install
npm run build
```

### Firefox
Compress all files in the `dist` folder to a zip file with the `.xpi` extension, then click **Load Temporary Add-on...** from `about:debugging`.

### Chrome
From **Manage Extensions** in Chrome, click **Load unpacked** and select the `dist` folder.
