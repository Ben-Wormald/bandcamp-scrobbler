const bandcamp = require('@ben-wormald/bandcamp-scraper');
const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+$/;

const getHtml = `(function() { return document.documentElement.outerHTML; })()`; 

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  const { url } = tabs[0];
  if (url.match(albumRegex)) {
    chrome.tabs.getSelected(null, tab => {
      chrome.tabs.executeScript(tab.id, { code: getHtml }, result => {
        const html = result[0];
        const albumInfo = bandcamp.parseAlbumInfo(html, url);
        alert(albumInfo.title);

        // set popup html

        // chrome.runtime.sendMessage(
        //   { type: 'scrobble', data: { albumInfo } },
        //   response => {
        //     alert(response);
        //   },
        // );
      });
    });
  }
});
