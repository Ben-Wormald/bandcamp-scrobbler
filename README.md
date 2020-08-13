# Bandcamp Scrobbler

A Chrome extension for scrobbling to Last.fm from a Bandcamp album page.

You currently need to provide your own Last.fm API credentials to compile the extension.
Export the following keys to your terminal session:

```bash
export SECRET_KEY=xxx
export API_KEY=xxx
export SESSION_KEY=xxx
```

Compile the extension:

```bash
npm install
npm run build
```

Then from **Manage Extensions** in Chrome, click **Load unpacked** and select the `dist` folder.
