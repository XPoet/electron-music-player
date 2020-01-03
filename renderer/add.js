const { ipcRenderer } = require('electron');
const path = require('path');
const { $ } = require('./helper');

let musicFilesPath = [];

const renderListHTML = (filePaths) => {
  const musicList = $('#music-list');
  const musicItemsHTML = filePaths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`;
    return html;
  }, '');
  musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`;
};


$('#select-music').addEventListener('click', () => {
  ipcRenderer.send('select-music');
});

ipcRenderer.on('selected-file', (event, args) => {
  if (Array.isArray(args.filePaths)) {
    renderListHTML(args.filePaths);
    musicFilesPath = args.filePaths;
  }
});


$('#import-music').addEventListener('click', () => {
  ipcRenderer.send('import-music', musicFilesPath);
});
