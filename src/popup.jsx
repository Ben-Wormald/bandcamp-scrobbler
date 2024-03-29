import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Auth from './components/Auth.jsx';
import Scrobbler from './components/Scrobbler.jsx';
import { sendMessage } from './utils/chrome.js';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    sendMessage('getLogin', {}, ({ hasToken: storedHasToken, username: storedUsername }) => {
      setHasToken(storedHasToken);
      setUsername(storedUsername);
      setLoading(false);
    });
  }, []);

  return (
    <div className="popup">
      <h1>bandcamp scrobbler</h1>
      {!loading && !username &&
        <Auth hasToken={hasToken} setHasToken={setHasToken} setUsername={setUsername} />
      }
      {!loading && username &&
        <Scrobbler username={username} setHasToken={setHasToken} setUsername={setUsername} />
      }
      {loading &&
        <h2>loading...</h2>
      }
    </div>
  );
}

render(<App />, document.body);
