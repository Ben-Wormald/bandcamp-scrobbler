const { parseAlbumInfo } = require('@ben-wormald/bandcamp-scraper');

const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+$/;
const getHtml = `(function() { return document.documentElement.outerHTML; })()`;

const sendMessage = (type, data, done) => {
  chrome.runtime.sendMessage({ type, data }, done);
};

const getAlbumInfo = (done, error) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const { url } = tabs[0];
    if (url.match(albumRegex)) {
      chrome.tabs.getSelected(null, tab => {
        try {
          chrome.tabs.executeScript(tab.id, { code: getHtml }, result => {
            const html = result[0];
            done(parseAlbumInfo(html, url));
          });
        } catch(e) {
          error(e);
        }
      });
    } else {
      error();
    }
  });
};

module.exports.sendMessage = sendMessage;
module.exports.getAlbumInfo = getAlbumInfo;
