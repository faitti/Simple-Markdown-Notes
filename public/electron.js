const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

const createWindow = () => {
  let window = new BrowserWindow({
    width: 800,
    height: 800,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    vibrancy: "ultra-dark",
    webPreferences: {},
  });

  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  window.on("closed", () => (window = null));
};

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
