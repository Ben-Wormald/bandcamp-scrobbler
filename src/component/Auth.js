const { h } = require('preact');
const { sendMessage } = require('../util/chrome');

const Auth = ({ hasToken, setHasToken, setUsername }) => {
  const handleSignIn = () => {
    sendMessage('getToken', {}, () => {
      setHasToken(true);
    });
  };

  const handleDone = () => {
    sendMessage('getSession', {}, ({ username }) => {
      setHasToken(false);
      setUsername(username);
    });
  };

  return (
    <div>
      {!hasToken
        ? <button onClick={handleSignIn}>Sign in with Last.fm</button>
        : <button onClick={handleDone}>Click here when done</button>
      }
    </div>
  );
};

module.exports.Auth = Auth;
