import { h } from 'preact';
import { sendMessage } from '../utils/chrome.js';

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
    <div className="auth">
      {!hasToken
        ? <button onClick={handleSignIn}>sign in with Last.fm</button>
        : <div>
            <p>allow this app access through Last.fm. when you're finished, click the button below</p>
            <button onClick={handleDone}>continue</button>
          </div>
      }
    </div>
  );
};

export default Auth;
