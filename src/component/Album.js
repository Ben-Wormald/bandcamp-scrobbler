const { h } = require('preact');

const Album = ({ album, setAlbum, handleScrobble }) => {
  const updateAlbum = field => ({ target: { value } }) => {
    album[field] = value
    setAlbum(album);
  };

  const updateTrack = (index, field) => ({ target: { value } }) => {
    const { tracks } = album;
    tracks[index][field] = value;
    setAlbum({
      ...album,
      tracks,
    });
  };

  const Track = (track, index) => {
    return (
      <div className="row">
        <input type="text" value={album.artist} onChange={updateTrack(index, 'artist')} />
        <input type="text" value={track.name} onChange={updateTrack(index, 'name')} />
        <input type="text" value={track.duration} onChange={updateTrack(index, 'duration')} />
      </div>
    );
  };

  return (
    <div className="album">
      <div className="row">
        <input type="text" value={album.artist} onChange={updateAlbum('artist')} />
        <input type="text" value={album.title} onChange={updateAlbum('title')} />
      </div>
      {album.tracks.map(Track)}
      <button onClick={handleScrobble}>Scrobble</button>
    </div>
  );
};

module.exports.Album = Album;
