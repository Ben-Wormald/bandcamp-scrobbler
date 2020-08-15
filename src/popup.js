const { h, render } = require('preact');
const { useState, useEffect } = require('preact/hooks');
const { Auth } = require('./component/Auth');
const { Scrobbler } = require('./component/Scrobbler');
const { sendMessage } = require('./util/chrome');

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
      <h1>Bandcamp Scrobbler</h1>
      {!loading && !username &&
        <Auth hasToken={hasToken} setHasToken={setHasToken} setUsername={setUsername} />
      }
      {!loading && username &&
        <Scrobbler username={username} setHasToken={setHasToken} setUsername={setUsername} />
      }
      {loading &&
        <h2>Loading...</h2>
      }
    </div>
  );
}

render(<App />, document.body);
