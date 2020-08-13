const { scrobble } = require('./scrobbler');

chrome.runtime.onMessage.addListener(
  ({ type, data }, sender, done) => {
    if (type === 'scrobble') {
      scrobble(data.albumData);
      return true;
    }
  }
);
