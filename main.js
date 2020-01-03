const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const MusicDataStore = require('./renderer/music-data-store');

const myStore = new MusicDataStore({ name: 'music-data' });

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    };
    // es5
    // const finalConfig = Object.assign(basicConfig, config);

    // es6
    const finalConfig = { ...basicConfig, ...config };

    super(finalConfig);
    this.loadFile(fileLocation);
    this.webContents.openDevTools();
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html');
  ipcMain.on('add-music-window', () => {
    new AppWindow({
      width: 800,
      height: 600,
      parent: mainWindow
    }, './renderer/add.html');
  });

  // 选择音乐
  ipcMain.on('select-music', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }).then(files => {
      if (files) event.sender.send('selected-file', files);
    });
  });

  // 导入音乐
  ipcMain.on('import-music', (event, args) => {
    const updatedTracks = myStore.addTracks(args).getTracks();
    console.log('updatedTracks', updatedTracks);
    mainWindow.send('get-tracks', updatedTracks);
  });
});