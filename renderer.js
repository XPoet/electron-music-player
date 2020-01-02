const { ipcRenderer } = require('electron');

/* 进程之间采用 ipcRenderer 进行通信 */
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('message', 'hello from renderer');

  ipcRenderer.on('reply', (event, args) => {
    window.document.querySelector('#message').innerHTML = args;
  });
});