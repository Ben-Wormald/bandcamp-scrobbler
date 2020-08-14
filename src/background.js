const { scrobble, getToken } = require('./lastfm');

chrome.runtime.onMessage.addListener(
  ({ type, data }, sender, done) => {

    if (type === 'getToken') {
      getToken(({ token, apiKey }) => {
        const authUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&token=${token}`;
        chrome.tabs.create({ url: authUrl });
        done(token);
      });
      return true;
    }
    else if (type === 'scrobble') {
      scrobble(data.albumData, response => {
        done(response);
      });
      return true;
    }
  }
);
