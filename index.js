const { app, BrowserWindow, Menu, dialog, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const notepads = require('./notepads.json');
const openurl = require('openurl');


let devToolsOpened = false;

class GraphicsWindow {
    constructor() {
        try {
            this.window = null;
            this.current_z_index = 0;
            this.layers = []; // List to store layers
            this.active_layer = null; // Currently active layer

            this.currentProject = null;

            app.on('ready', () => {
                this.createWindow();
            });
        } catch (e) {
            const { Notification } = require('electron')

            const NOTIFICATION_TITLE = 'Error'
            const NOTIFICATION_BODY = `${e}`

            new Notification({
                title: NOTIFICATION_TITLE,
                body: NOTIFICATION_BODY
            }).show()
        }
    }

    async createWindow() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,   // Set the minimum width
            minHeight: 600,  // Set the minimum height
            frame: false, // Remove the default window frame (including the title bar)
            webPreferences: {
                nodeIntegration: true,
                spellcheck: false,
                preload: path.join(__dirname, './dist/js/preload.js'),
            },
        });

        // Set the window icon
        const iconPath = path.join(__dirname, './dist/images/icon.png');
        this.window.setIcon(iconPath);

        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);

        this.window.setMenu(menu);

        this.window.loadFile('./dist/html/home.html');

        this.window.on('closed', () => {
            this.window = null;
        });

    }
}

const graphicsWindow = new GraphicsWindow();

function save() {
    fs.writeFileSync('./notepads.json', JSON.stringify(notepads, null, 2));
}

function getTimestamp() {
    return Date.now();
}

ipcMain.on("page-refresh::set-timeout", (event, ...args) => {

})

ipcMain.on("close", () => {
    graphicsWindow.window.close();
})

ipcMain.on("minimize", () => {
    graphicsWindow.window.minimize();
})

ipcMain.on("dev-refresh", () => {
    graphicsWindow.window.reload();
})

ipcMain.on("toggle-dev-tools", () => {

    // Toggle the DevTools visibility based on its current state
    if (devToolsOpened) {
        graphicsWindow.window.webContents.closeDevTools();
        devToolsOpened = false;
    } else {
        graphicsWindow.window.webContents.openDevTools();
        devToolsOpened = true;
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on("newNotepad", (ev, ...args) => {
    let name = args[0] || null;
    if (name) {
        let template = {
            name: name,
            plainText: '',
            html: '',
            lastUpdated: getTimestamp()
        }
        notepads.notes.push(template);
        save();
    }
    graphicsWindow.window.webContents.send("newNotepad");
})
ipcMain.on("save", (ev, ...args) => {
    try {
        let { content, notepad } = args[0];
        let index = -1
        for (let i = 0; i < notepads.notes.length; i++) {
            let x = notepads.notes[i];
            if (x.name == notepad) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            notepads.notes[index].html = content;
            notepads.notes[index].plainText = content.replace(/<[^>]*>/g, ''); // Remove tags
            notepads.notes[index].lastUpdated = getTimestamp();
            save();
        }
    } catch (e) { }
})

ipcMain.on("open_url", (ev, ...data) => {
    let url = data[0];
    console.log("open_url", url);
    openurl(url, e => {
        console.log(e);
    });
})