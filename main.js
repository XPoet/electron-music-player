const { app, BrowserWindow, ipcMain } = require('electron');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('index.html');

  // 主进程的IPC监听 renderer 的 message 方法
  ipcMain.on('message', (event, args) => {
    console.log(args);

    // 主进程的IPC 发送 reply 方法
    // event.sender.send('reply', 'hello from main');
    mainWindow.send('reply', 'hello from main');
  });

});