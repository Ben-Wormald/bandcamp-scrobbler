const { scrobble, getToken, getSession } = require('./lastfm');

const handleMessage = async (type, data, done) => {
  if (type === 'getToken') {
    const { token, apiKey } = await getToken();
    console.log(`Got auth token ${token}`);

    const authUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&token=${token}`;
    chrome.tabs.create({ url: authUrl });

    chrome.storage.sync.set({ token }, () => {
      console.log('Saved auth token to storage');
      done();
    });
  }

  if (type === 'getSession') {
    const handleGetSession = async (token, done) => {
      const { key, name } = await getSession(token);
      console.log(`Got session key ${key} for user ${name}`);

      chrome.storage.sync.set({ key, name }, () => {
        console.log('Saved session key and username to storage');
        done(name);
      });
    };

    chrome.storage.sync.get(['token'], ({ token }) => {
      console.log(`Got auth token from storage ${token}`);
      handleGetSession(token, done);
    });
  }
  
  if (type === 'scrobble') {
    const handleScrobble = async (albumData, key, done) => {
      const response = await scrobble(albumData, key);
      console.log('Scrobbled', response);
      done(response);
    };

    chrome.storage.sync.get(['key'], ({ key }) => {
      console.log(`Got session key from storage ${key}`);
      handleScrobble(data.albumData, key, done);
    });
  }
};

chrome.runtime.onMessage.addListener(
  ({ type, data }, sender, done) => {
    handleMessage(type, data, done);
    return true;
  }
);
