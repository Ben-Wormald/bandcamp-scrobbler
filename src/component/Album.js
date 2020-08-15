const { h } = require('preact');
const { useState, useEffect } = require('preact/hooks');

const Album = ({ album, handleScrobble }) => {

  const Track = track => {
    return (
      <div className="row">
        <input type="text" value={album.artist} />
        <input type="text" value={track.name} />
        <input type="text" value={track.duration} />
      </div>
    );
  };

  return (
    <div className="album">
      <div className="row">
        <input type="text" value={album.artist} />
        <input type="text" value={album.title} />
      </div>
      {album.tracks.map(Track)}
      <button onClick={handleScrobble}>Scrobble</button>
    </div>
  );
};

module.exports.Album = Album;
