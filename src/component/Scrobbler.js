const { h } = require('preact');
const { useState, useEffect } = require('preact/hooks');
const { Album } = require('./Album');
const { sendMessage, getAlbumInfo } = require('../util/chrome');

const Scrobbler = ({ username, setHasToken, setUsername }) => {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    getAlbumInfo(
      albumInfo => {
        setAlbum(albumInfo);
        setLoading(false);
      },
      error => {
        setLoading(false);
      }
    );
  }, []);

  const handleScrobble = () => {
    setLoading(true);
    sendMessage('scrobble', { album }, scrobbleResponse => {
      setResponse(scrobbleResponse);
      setLoading(false);
    });
  };

  const handleSignOut = () => {
    sendMessage('signOut', {}, () => {
      setHasToken(false);
      setUsername(null);
    });
  };

  return (
    <div>
      <h2>Logged in as {username}</h2>
      <div className="scrobbler">
        {!loading && !response && album &&
          <Album album={album} setAlbum={setAlbum} handleScrobble={handleScrobble} />
        }
        {!loading && !response && !album &&
          <p>Open a Bandcamp album page to scrobble</p>
        }
        {!loading && response &&
          <div>
            <p>Done!</p>
            <p>{response.accepted} tracks scrobbled</p>
            {response.ignored.length && <p>{response.ignored.length} tracks ignored</p>}
          </div>
        }
        {loading &&
          <p>Loading...</p>
        }
      </div>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
};

module.exports.Scrobbler = Scrobbler;
