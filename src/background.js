const { scrobble, getToken, getSession } = require('./lastfm');

const handleMessage = async (type, data, done) => {
  if (type === 'getToken') {
    const { token, apiKey } = await getToken();
    console.log(`Got auth token ${token}`);

    const authUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&token=${token}`;
    chrome.tabs.create({ url: authUrl });

    chrome.storage.sync.set({ token }, () => {
      console.log('Saved auth token to storage');
      done(token);
    });
  }

  if (type === 'getSession') {
    const handleGetSession = async (token, done) => {
      const { key, name } = await getSession(token);
      console.log(`Got session key ${key} for user ${name}`);

      chrome.storage.sync.set({ key, name }, () => {
        console.log('Saved session key and username to storage');
        done({ key, name });
      });
    };

    chrome.storage.sync.get(['token'], ({ token }) => {
      console.log(`Got auth token from storage ${token}`);
      handleGetSession(token, done);
    });
  }
  
  if (type === 'scrobble') {
    const response = await scrobble(data.albumData);
    console.log('Scrobbled', response);
    done(response);
  }
};

chrome.runtime.onMessage.addListener(
  ({ type, data }, sender, done) => {
    handleMessage(type, data, done);
    return true;
  }
);
