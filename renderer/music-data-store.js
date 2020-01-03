const Store = require('electron-store');
const uuid = require('uuid/v4');
const path = require('path');


class MusicDataStore extends Store {

  constructor(settings) {
    super(settings);
    this.tracks = this.get('tracks') || [];
  }

  saveTracks() {
    this.set('tracks', this.tracks);
    return this;
  }

  getTracks() {
    return this.get('tracks') || [];
  }

  addTracks(tracks) {
    const tracksWithProps = tracks.map(track => {
      return {
        id: uuid(),
        path: track,
        filename: path.basename(track)
      };
    }).filter(track => {
      const currentTracksPath = this.getTracks().map(track => track.path);
      return currentTracksPath.indexOf(track.path) < 0;
    });

    this.tracks = [...this.tracks, ...tracksWithProps];
    return this.saveTracks();
  }

  deleteTrack(deletedId) {
    // 删除数组中指定元素的巧妙用法：过滤出id不相等的元素，相当于把指定id元素删除了
    this.tracks = this.tracks.filter(item => item.id !== deletedId);
    return this.saveTracks();
  }

}

module.exports = MusicDataStore;