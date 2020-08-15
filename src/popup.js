const bandcamp = require('@ben-wormald/bandcamp-scraper');

const albumRegex = /^https:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_-]+$/;
const getHtml = `(function() { return document.documentElement.outerHTML; })()`;
let trackCount;

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  const { url } = tabs[0];
  if (url.match(albumRegex)) {
    chrome.tabs.getSelected(null, tab => {
      chrome.tabs.executeScript(tab.id, { code: getHtml }, result => {
        const html = result[0];
        const albumInfo = bandcamp.parseAlbumInfo(html, url);
        trackCount = albumInfo.tracks.length;
        renderForm(albumInfo);
      });
    });
  }
});

const renderForm = ({ artist, title, tracks }) => {
  document.getElementById('artist').value = artist;
  document.getElementById('title').value = title;
  
  const tracksElement = document.getElementById('tracks');
  tracks.forEach((track, index) => tracksElement.appendChild(renderTrack(artist, track, index)));
};

const renderTrack = (artist, { name, duration }, index) => {
  const div = document.createElement('div');

  const artistInput = document.createElement('input');
  artistInput.id = `artist-${index}`;
  artistInput.value = artist;

  const nameInput = document.createElement('input');
  nameInput.id = `name-${index}`;
  nameInput.value = name;

  const durationInput = document.createElement('input');
  durationInput.id = `duration-${index}`;
  durationInput.value = duration;

  div.appendChild(artistInput);
  div.appendChild(nameInput);
  div.appendChild(durationInput);
  return div;
};

const getFormData = () => {
  const artist = document.getElementById('artist').value;
  const title = document.getElementById('title').value;

  const tracks = [];
  for (let i = 0; i < trackCount; i++) {
    tracks.push({
      artist: document.getElementById(`artist-${i}`).value,
      name: document.getElementById(`name-${i}`).value,
      duration: document.getElementById(`duration-${i}`).value,
    });
  }

  return {
    artist,
    title,
    tracks,
  };
};

document.getElementById('submit').addEventListener('click', () => {
  const albumData = getFormData();
  chrome.runtime.sendMessage(
    { type: 'scrobble', data: { albumData } },
    response => {
      alert(response);
    },
  );
});

document.getElementById('token').addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: 'getToken' },
    response => {
      // alert('got auth token');
    },
  );
});

document.getElementById('session').addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: 'getSession' },
    username => {
      alert(`Logged in as ${username}`);
    },
  );
});
