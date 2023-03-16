const { selectors } = require('./bandcamp');

const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+[a-zA-Z0-9_=&+-?]*$/;
const getHtml = `(function() { return document.documentElement.outerHTML; })()`;

const sendMessage = (type, data, done) => {
  chrome.runtime.sendMessage({ type, data }, done);
};

const getAlbumInfo = (done, error) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const { url, id: tabId } = tabs[0];

    if (url.match(albumRegex)) {
      try {
        chrome.tabs.executeScript(tabId, { code: getHtml }, result => {
          const html = result[0];
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const artist = doc.querySelector(selectors.artist).textContent.trim();
          const title = doc.querySelector(selectors.title).textContent.trim();

          const trackContainers = doc.querySelectorAll(selectors.track.container);

          const tracks = Array.from(trackContainers).map((track) => {
            const name = track.querySelector(selectors.track.name).textContent.trim();
            const duration = track.querySelector(selectors.track.duration).textContent.trim();

            return { name, duration };
          });

          done({ artist, title, tracks });
        });
      } catch(e) {
        error(e);
      }
    } else {
      error();
    }
  });
};

const openTab = url => chrome.tabs.create({ active: true, url });

module.exports.sendMessage = sendMessage;
module.exports.getAlbumInfo = getAlbumInfo;
module.exports.openTab = openTab;
