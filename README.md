# Bandcamp Scrobbler

A Chrome extension for scrobbling to Last.fm from a Bandcamp album page.
Available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/bandcamp-scrobbler/cnmjkkjnmdhhemfbokmblfioalnbnlej).

Open from the Chome extensions menu on any Bandcamp album page.
You can adjust the album details before scrobbling, and clear the title of any tracks you want to skip.

## Development

To compile the extension yourself, you'll need to provide keys for your own [Last.fm API app](https://www.last.fm/api/intro):

```bash
export API_KEY=xxx
export SECRET_KEY=xxx

npm install
npm run build
```

Then from **Manage Extensions** in Chrome, click **Load unpacked** and select the `dist` folder.
