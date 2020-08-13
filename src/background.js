chrome.runtime.onMessage.addListener(
  ({ type, data }, sender, done) => {
    if (type === 'scrobble') {
      // send to last.fm
      return true;
    }
  }
);
