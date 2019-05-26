const { app, BrowserWindow } = require("electron");
var mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        show: false
    });
    mainWindow.openDevTools({detached: true})
    mainWindow.maximize();
    mainWindow.loadFile("index.html");

    mainWindow.on("ready-to-show", ()=>{
        mainWindow.show()
    })

    mainWindow.on("closed", ()=>{
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", ()=>{
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", ()=>{
    if (mainWindow === null) {
        createWindow();
    }
});
