import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Album from './Album.jsx';
import { sendMessage, getAlbumInfo, openTab } from '../utils/chrome.js';
import { checkCompilation } from '../utils/bandcamp.js';

const Scrobbler = ({ username, setHasToken, setUsername }) => {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    (async () => {
      const albumInfo = await getAlbumInfo();

      if (albumInfo) {
        setAlbum(checkCompilation(albumInfo));
      }

      setLoading(false);
    })();
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
    <Fragment>
      <h2>signed in as <a onClick={() => openTab(`https://www.last.fm/user/${username}`)}>{username}</a> | <a onClick={handleSignOut}>sign out</a></h2>
      <div className="divider"></div>
      <div className="scrobbler">
        {!loading && !response && album &&
          <Album album={album} setAlbum={setAlbum} handleScrobble={handleScrobble} />
        }
        {!loading && !response && !album &&
          <p>open a <a onClick={() => openTab('https://bandcamp.com')} className="a--blue">bandcamp</a> album page to scrobble</p>
        }
        {!loading && response &&
          <div>
            <p>done!</p>
            <p>{response.accepted} tracks scrobbled</p>
            {response.ignored.length && <p>{response.ignored.length} tracks ignored</p>}
          </div>
        }
        {loading &&
          <h2>loading...</h2>
        }
      </div>
    </Fragment>
  );
};

export default Scrobbler;
