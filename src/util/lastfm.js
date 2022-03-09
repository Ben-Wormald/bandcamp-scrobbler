const md5 = require('js-md5');

const dropInvalidDurations = false;

const processDurations = (data, count) => {
  const currentTime = Math.floor((new Date()).getTime() / 1000);
  var durationSum = 0;

  for (var i = count - 1; i >= 0; i--) {
    durationSum += data[`duration[${i}]`];

    data[`timestamp[${i}]`] = currentTime - durationSum;

    if (dropInvalidDurations && (currentTime <= 30 || currentTime >= 3600)) {
      delete data[`duration[${i}]`];
    }
  }
  return data;
}

const processTrackData = ({ artist, title, tracks }) => {
  const trackData = {};
  let count = 0

  tracks.forEach((track, index) => {
    if (!track.name || !track.duration) return;

    var duration = track.duration.split(':');
    duration = duration.length === 1 ? parseInt(duration[0]) : parseInt(duration[0]) * 60 + parseInt(duration[1]);

    trackData[`artist[${index}]`] = track.artist || artist;
    trackData[`albumArtist[${index}]`] = artist;
    trackData[`album[${index}]`] = title;
    trackData[`track[${index}]`] = track.name;
    trackData[`duration[${index}]`] = duration;
    trackData[`trackNumber[${index}]`] = index + 1;

    count++;
  });

  return processDurations(trackData, count);
}

const generateSignature = data => {
  const urlParams = [];
  for (const key in data) {
    if (key !== 'format') {
      urlParams.push(key + data[key]);
    }
  }
  urlParams.sort();
  return md5(urlParams.join('') + process.env.SECRET_KEY);
}

const processResponse = ({ scrobbles }) => {
  const response = {
    accepted: scrobbles['@attr'].accepted,
    ignored: [],
  };

  if (scrobbles['@attr'].ignored) {
    scrobbles.scrobble.forEach(({ track, ignoredMessage }) => {
      if (ignoredMessage.code) {
        response.ignored.push({
          track: track['#text'],
          message: ignoredMessage['#text']
        });
      }
    });
  }
  return response;
}

const scrobble = async (albumData, sessionKey) => {
  const trackData = processTrackData(albumData);

  trackData.api_key = process.env.API_KEY;
  trackData.sk = sessionKey;
  trackData.method = 'track.scrobble';
  trackData.format = 'json';
  trackData.api_sig = generateSignature(trackData);

  const body = new URLSearchParams(trackData).toString();

  const response = await fetch('http://ws.audioscrobbler.com/2.0/', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  return processResponse(json);
}

const getToken = async () => {
  const params = {
    method: 'auth.gettoken',
    api_key: process.env.API_KEY,
    format: 'json',
  };

  const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(params)}`;
  const response = await fetch(url);

  const { token } = await response.json();
  return {
    token,
    apiKey: process.env.API_KEY,
  };
};

const getSession = async token => {
  const params = {
    method: 'auth.getsession',
    api_key: process.env.API_KEY,
    token,
    format: 'json',
  };
  params.api_sig = generateSignature(params);

  const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(params)}`;
  const response = await fetch(url);

  const { session: { key, name } } = await response.json();
  return { key, name };
};

const checkCompilation = album => {
  const separator = ' - ';
  
  if (album.tracks.every(({ name }) => name.includes(separator))) {
    return {
      ...album,
      tracks: album.tracks.map(track => {
        const parts = track.name.split(separator);
        return {
          ...track,
          artist: parts[0],
          name: parts.slice(1).join(separator),
        };
      }),
    };
  }

  return album;
};

module.exports.scrobble = scrobble;
module.exports.getToken = getToken;
module.exports.getSession = getSession;
module.exports.checkCompilation = checkCompilation;
