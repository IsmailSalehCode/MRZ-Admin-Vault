// electron/electron.js
const path = require("path");
const { app, BrowserWindow, Menu, MenuItem, shell } = require("electron");
const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "../assets/icon.ico"),
  });

  mainWindow.removeMenu();
  mainWindow.webContents.on("context-menu", (_, props) => {
    const menu = new Menu();
    if (props.isEditable || props.selectionText) {
      menu.append(new MenuItem({ label: "Изрежи", role: "cut" }));
      menu.append(new MenuItem({ label: "Копирай", role: "copy" }));
      menu.append(new MenuItem({ label: "Постави", role: "paste" }));
      menu.popup();
    }
  });

  /**
   * Source: https://pradyothkukkapalli.com/tech/open-external-urls-electron/
   * This handler prevents all window open requests from changing the URL inside your app, and instead causes the URL to open in the user’s browser. However, this only works if your links open new windows/tabs. You can have anchor tags with target="_blank", or call window.open with a _blank target */
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); // Open URL in user's browser.
    return { action: "deny" }; // Prevent the app from opening the URL.
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  // if (isDev) { TODO UNCOMMENT
  mainWindow.webContents.openDevTools();
  //Note: opening dev tools prevents mrzField foucs (mounted(){} hook in ReadAddMRZ.vue)
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// TODO: remove locales folder from final build
/**
 * When using electron-builder, you can default to the locale en-US via
app.commandLine.appendSwitch('lang', 'en-US'); // before app.on('ready', ...)
and remove the unused locales from your electron project via the "afterPack" hook in the package.json
"build": { "afterPack": "./removeLocales.js", ... }
which could look like

//https://www.electron.build/configuration/configuration#afterpack
exports.default = async function(context) {
	//console.log(context)
	var fs = require('fs');
	var localeDir = context.appOutDir+'/locales/';

	fs.readdir(localeDir, function(err, files){
		//files is array of filenames (basename form)
		if(!(files && files.length)) return;
		for (var i = 0, len = files.length; i < len; i++) {
			var match = files[i].match(/en-US\.pak/); 
      //добави и bg-BG.pak
			if(match === null){
				fs.unlinkSync(localeDir+files[i]);
			}
		}
	});
}
 */
