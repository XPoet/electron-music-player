const { ipcRenderer } = require('electron');
const { $, convertDuration } = require('./helper');
const musicAudio = new Audio();
let allTracks;
let currentTrack;

$('#add-music').addEventListener('click', () => {
  ipcRenderer.send('add-music-window');
});

const renderListHTML = (tracks) => {
  const tracksListDOM = $('.main-window-music-list');
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track-item list-group-item d-flex align-items-center">
                <div class="col-10 float-left">
                    <i class="fas fa-music mr-2 text-primary"></i><b>${track.filename}</b>
                </div>
                <div class="col-2">
                    <i class="fas fa-play mr-3" data-id="${track.id}"></i>
                    <i class="fas fa-trash-alt" data-id="${track.id}"></i>
                </div>
            </li>`;
    return html;
  }, '');

  const emptyTrackHTML = `<div class="alert alert-danger" role="alert">暂未添加任何音乐文件！</div>`;

  tracksListDOM.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML;
};

const renderPlayerHTML = (musicName, duration) => {
  const playerDOM = $('#player-status');
  const html = `
    <div class="col text-left font-weight-bold">正在播放：${musicName}</div>
    <div class="col text-right"><span id="current-seeker">00:00</span> / ${convertDuration(duration)}</div>
  `;
  playerDOM.innerHTML = html;
};

const updateProgressHTML = (currentTime, duration) => {
  const seeker = $('#current-seeker');
  seeker.innerHTML = convertDuration(currentTime);

  const progress = (currentTime / duration * 100).toFixed(2);
  const bar = $('#player-progress');
  bar.innerHTML = progress + '%';
  bar.style.width = progress + '%';

};


// 监听到获取所有音乐列表
ipcRenderer.on('get-tracks', (event, args) => {
  allTracks = args;
  renderListHTML(args);
});

$('.main-window-music-list').addEventListener('click', event => {
  event.preventDefault();
  const { dataset, classList } = event.target;
  const id = dataset && dataset.id;

  if (id && classList.contains('fa-play')) {

    // 继续播放音乐
    if (currentTrack && currentTrack.id === id) {
      musicAudio.play();

    } else {

      // 播放新的音乐
      currentTrack = allTracks.find(v => v.id === id);
      musicAudio.src = currentTrack.path;
      musicAudio.play();
      const resetIconElement = $('.fa-pause');
      if (resetIconElement) {
        resetIconElement.classList.replace('fa-pause', 'fa-play');
      }
    }

    classList.replace('fa-play', 'fa-pause');

  } else if (id && classList.contains('fa-pause')) {
    // 暂停音乐
    musicAudio.pause();
    classList.replace('fa-pause', 'fa-play');

  } else if (id && classList.contains('fa-trash-alt')) {
    // 删除音乐
    ipcRenderer.send('delete-track', id);
  }


});

musicAudio.addEventListener('loadedmetadata', () => {
  renderPlayerHTML(currentTrack.filename, musicAudio.duration);
});

musicAudio.addEventListener('timeupdate', () => {
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration);
});