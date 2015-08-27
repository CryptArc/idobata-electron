'use strict'

const app = require('app');
const BrowserWindow = require('browser-window');
const ipc = require('ipc');
const fs = require('fs');
const path = require('path');

require('crash-reporter').start();

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadUrl(`file://${__dirname}/index.html`);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('setNotificationMode', function(mode) {
  var config_path = path.join(app.getPath('userData'), 'config');

  fs.readFile(config_path, function(err, data) {
    var config = data ? JSON.parse(data) : {};
    config.notificationMode = mode;

    fs.writeFile(config_path, JSON.stringify(config), function(err){
      // some-op？
    });
  });
});

ipc.on('getNotificationMode', function(event) {
  var config_path = path.join(app.getPath('userData'), 'config');

  fs.readFile(config_path, function(_, data) {
    var config = data ? JSON.parse(data) : {notificationMode: 'never'};

    event.returnValue = config.notificationMode;
  });
});
