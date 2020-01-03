const { ipcRenderer } = require('electron');
const { $ } = require('./helper');
$('#add-music').addEventListener('click', () => {
  ipcRenderer.send('add-music-window');
});