// electron/electron.js
const path = require("path");
const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const { sequelize } = require("../DB/config");
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
  });

  mainWindow.removeMenu();

  mainWindow.webContents.on("context-menu", (_, props) => {
    const menu = new Menu();
    if (props.isEditable) {
      menu.append(new MenuItem({ label: "Изрежи", role: "cut" }));
      menu.append(new MenuItem({ label: "Копирай", role: "copy" }));
      menu.append(new MenuItem({ label: "Постави", role: "paste" }));
      menu.popup();
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  // if (isDev) {
  mainWindow.webContents.openDevTools();
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Move the sequelize initialization code outside of the activate event handler
  initializeDatabase();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    await sequelize.sync({ alter: true });
    console.log("Database synchronization completed.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  // Close the database connection when all windows are closed
  sequelize.close();
});
