const selectors = {
  artist: '#name-section span',
  title: '#name-section .trackTitle',
  track: {
    container: '#track_table .track_row_view',
    name: '.track-title',
    duration: '.time',
  },
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

export {
  selectors,
  checkCompilation,
};
