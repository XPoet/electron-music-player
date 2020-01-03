const { ipcRenderer } = require('electron');
const { $ } = require('./helper');
/* 进程之间采用 ipcRenderer 进行通信 */
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('message', 'hello from renderer');

  ipcRenderer.on('reply', (event, args) => {
    $('#message').innerHTML = args;
  });
});