const { app, BrowserWindow, Menu, dialog, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const storage = require('./dist/data.json');

const EXTENSION = "dbm"

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

        const toggleDevTools = () => {
            this.window.webContents.toggleDevTools();
        }

        const newFile = async () => {
            console.log("new")
        }

        const open = async () => {
            console.log("open")
        }

        const save = () => {
            if (true) {
                console.log("Save")
            }
        }

        const saveas = () => {
            if (true) {
                console.log("save as")
            }
        }

        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);

        this.window.setMenu(menu);

        this.window.loadFile('./dist/html/main.html');

        this.window.on('closed', () => {
            this.window = null;
        });

    }
}

class Notebook {
    constructor(filename = null) {
        // open the file and store it
        this.pages = [];
        this.filename = filename;
    }

    AddPage(page) {
        this.pages.push(page);
    }

    DelPage(page) {
        this.pages.splice(this.pages.indexOf(page), 1);
    }

    RefreahPages(window) {
        for (const page of this.pages) {
            page.update();
            window.webContents.send("page-refresh", page);
        }
    }

    serialize() {
        let data = {
            "notes": this.pages,
            "filename": this.filename
        }
        storage = data;
        fs.writeFileSync('./dist/data.json', JSON.stringify(storage, null, 2));
    }

    deserialize() {
        this.pages = storage.pages;
        this.filename = storage.filename;
    }
}

class Element {
    constructor(type = "default", content = "", position = { x: 0, y: 0 }, color = "#00000000") {
        this.type = type;
        this.content = content;
        this.position = position;
        this.color = color;
    }

    createVisuals() {
        return `
        <span style="position:fixed;border-color:${this.color};border-width:1px;border-style:solid;left:${this.position.x};top:${this.position.y};">
        ${this.content}
        </span>`
    }
}

class Notepad {
    constructor(order = 0, name = "New Note") {
        this.order = order;
        this.content = []; // type element
        this.visuals = []; // type string
        this.name = name;
    }

    update() {
        this.visuals = [];
        for (const e of this.content) {
            this.visuals.push(e.createVisuals());
        }
        // Refresh the visuals using the updated backend information
    }
}

const graphicsWindow = new GraphicsWindow();
const notebook = new Notebook();

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

ipcMain.on("NewNote", () => {
    let n = new Notepad(notebook.pages.length, `New Note (${notebook.pages.length + 1})`);
    notebook.AddPage(n);
    storage.notes.push({ name: n.name, order: n.order, visuals: n.visuals })
    fs.writeFileSync('./dist/data.json', JSON.stringify(storage, null, 2));
    graphicsWindow.window.webContents.send("NewNote", { name: n.name, order: n.order });
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