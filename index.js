const { app, BrowserWindow, Menu, dialog, ipcMain, autoUpdater, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const notepads = require('./notepads.json');

let devToolsOpened = false;

class GraphicsWindow {
    constructor() {
        try {
            this.window = null;
            this.current_z_index = 0;
            this.layers = []; // List to store layers
            this.active_layer = null; // Currently active layer

            this.currentProject = null;

            app.on('ready', async () => {
                await this.createWindow();
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

        this.window.loadFile('./dist/html/loading.html');

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

// Hooks
{
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
                lastUpdated: getTimestamp(),
                isCurrentlySelected: false
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
                console.log("Saving");
                notepads.notes[index].html = content;
                notepads.notes[index].plainText = content.replace(/<[^>]*>/g, ''); // Remove tags
                notepads.notes[index].lastUpdated = getTimestamp();
                save();
                graphicsWindow.window.webContents.send("save", true);
            }
        } catch (e) {
            console.error(e);
            graphicsWindow.window.webContents.send("save", false);
        }
    })

    ipcMain.on("open_url", (ev, ...data) => {
        let url = data[0];
        console.log("open_url", url);
        shell.openExternal(url);
    })

    ipcMain.on("notepadSelected", (ev, ...data) => {
        console.log(data);
        for (let i = 0; i < notepads.notes.length; i++) {
            let x = notepads.notes[i];
            if (x.name == data[0]) {
                notepads.notes[i].isCurrentlySelected = true;
                graphicsWindow.window.webContents.send("load_html", x.html);
                graphicsWindow.window.webContents.send("set_active", x.name);
            } else {
                notepads.notes[i].isCurrentlySelected = false;
            }
        }
        save();
    })

    ipcMain.on("loaded", async () => {
        await graphicsWindow.window.loadFile('./dist/html/home.html');
        setTimeout(() => {
            for (let notepad of notepads.notes) {
                graphicsWindow.window.webContents.send("AddToSideMenu", notepad.name);
                if (notepad.isCurrentlySelected) {
                    graphicsWindow.window.webContents.send("load_html", notepad.html);
                    graphicsWindow.window.webContents.send("set_active", notepad.name);
                }
            }
        }, 500);
    })
}