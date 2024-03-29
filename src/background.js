import { scrobble, getToken, getSession } from './utils/lastfm.js';

const handleMessage = async (type, data, done) => {
  if (type === 'getToken') {
    const { token, apiKey } = await getToken();
    console.log(`Got auth token ${token}`);

    const authUrl = `https://www.last.fm/api/auth/?api_key=${apiKey}&token=${token}`;
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

      // TODO handle token not validated

      chrome.storage.sync.set({ token: null, key, name }, () => {
        console.log('Saved session key and username to storage');
        done({ username: name });
      });
    };

    chrome.storage.sync.get(['token'], ({ token }) => {
      console.log(`Got auth token from storage ${token}`);
      handleGetSession(token, done);
    });
  }

  if (type === 'getLogin') {
    chrome.storage.sync.get(['token', 'name'], ({ token, name }) => {
      const response = {
        hasToken: !!token,
        username: name
      };
      console.log('Login retrieved from storage', response);
      done(response);
    });
  }

  if (type === 'signOut') {
    chrome.storage.sync.set({ token: null, key: null, name: null }, () => {
      console.log('Signed out and cleared storage');
      done();
    });
  }
  
  if (type === 'scrobble') {
    const handleScrobble = async (album, key, done) => {
      console.log('About to scrobble', album);
      const response = await scrobble(album, key);
      console.log('Scrobbled', response);
      done(response);
    };

    chrome.storage.sync.get(['key'], ({ key }) => {
      console.log(`Got session key from storage ${key}`);
      handleScrobble(data.album, key, done);
    });
  }
};

chrome.runtime.onMessage.addListener(
  ({ type, data }, _sender, done) => {
    handleMessage(type, data, done);
    return true;
  }
);
