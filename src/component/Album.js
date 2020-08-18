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
        <p className="track-index">{index + 1}</p>
        <input type="text" value={album.artist} onChange={updateTrack(index, 'artist')} />
        <input type="text" value={track.name} onChange={updateTrack(index, 'name')} />
        <input type="text" value={track.duration} onChange={updateTrack(index, 'duration')} className="duration" />
      </div>
    );
  };

  return (
    <div className="album">
      <div className="row">
        <p className="track-index label"></p>
        <p className="label">artist</p>
        <p className="label">album</p>
      </div>
      <div className="row">
        <p className="track-index label"></p>
        <input type="text" value={album.artist} onChange={updateAlbum('artist')} />
        <input type="text" value={album.title} onChange={updateAlbum('title')} />
      </div>

      <div className="row">
        <p className="track-index label">#</p>
        <p className="label">artist</p>
        <p className="label">track</p>
        <p className="label duration">duration</p>
      </div>
      {album.tracks.map(Track)}
      <button onClick={handleScrobble} className="scrobble-button">scrobble</button>
    </div>
  );
};

module.exports.Album = Album;
