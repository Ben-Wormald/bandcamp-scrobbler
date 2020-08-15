const request = require('request-promise');
const md5 = require('js-md5');
const querystring = require('querystring');
const { doesNotMatch } = require('assert');

// const dropInvalidDurations = process.env.DROP_INVALID_DURATIONS === 'true';
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

  const body = querystring.stringify(trackData);

  const response = await request({
    method: 'POST',
    uri: 'http://ws.audioscrobbler.com/2.0/',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return processResponse(JSON.parse(response));
}

const getToken = async () => {
  const qs = {
    method: 'auth.gettoken',
    api_key: process.env.API_KEY,
    format: 'json',
  };

  const response = await request({
    method: 'GET',
    uri: 'http://ws.audioscrobbler.com/2.0/',
    qs
  });

  const { token } = JSON.parse(response);
  return {
    token,
    apiKey: process.env.API_KEY,
  };
};

const getSession = async token => {
  const qs = {
    method: 'auth.getsession',
    api_key: process.env.API_KEY,
    token,
    format: 'json',
  };
  qs.api_sig = generateSignature(qs);

  const response = await request({
    method: 'GET',
    uri: 'http://ws.audioscrobbler.com/2.0/',
    qs,
  });

  const { session: { key, name } } = JSON.parse(response);
  return { key, name };
};

module.exports.scrobble = scrobble;
module.exports.getToken = getToken;
module.exports.getSession = getSession;
