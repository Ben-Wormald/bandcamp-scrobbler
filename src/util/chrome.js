const { selectors } = require('./bandcamp');

const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+[a-zA-Z0-9_=&+-?]*$/;

const sendMessage = (type, data, done) => {
  chrome.runtime.sendMessage({ type, data }, done);
};

const getAlbumInfo = async () => {
  const [{ url, id: tabId }] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (!url.match(albumRegex)) return null;

  const [{ result: html }] = await chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: () => document.documentElement.outerHTML,
  });
  
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

  return { artist, title, tracks };
};

const openTab = url => chrome.tabs.create({ active: true, url });

module.exports.sendMessage = sendMessage;
module.exports.getAlbumInfo = getAlbumInfo;
module.exports.openTab = openTab;
