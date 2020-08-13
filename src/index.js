const bandcamp = require('bandcamp-scraper');

const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+$/;

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  const { url } = tabs[0];
  if (url.match(albumRegex)) {
    // https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
    bandcamp.getAlbumInfo(url, (error, albumInfo) => {
      alert(error || albumInfo.title);
    });
  }
});
