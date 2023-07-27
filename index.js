const { app, BrowserWindow, Menu, dialog, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');

const discord = require('./dist/discord/main.js');
const twitch = require('./dist/twitch/twi.js');

const EXTENSION = "dbm"

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
            webPreferences: {
                nodeIntegration: true,
                spellcheck: false,
                preload: path.join(__dirname, './dist/js/preload.js')
            },
        });

        discord.Action.add_handler((...args) => {
            this.window.webContents.send("action", args);
        })

        // Set the window icon
        const iconPath = path.join(__dirname, './dist/images/icon.png');
        this.window.setIcon(iconPath);

        const placeholder = (prompt) => {
            let func = () => {
                console.log(prompt);
            }
            return func;
        }

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

        await populateThemes(this.window).catch(console.error);

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    { label: 'New', click: newFile },
                    { label: 'Open', click: open },
                    { label: 'Refresh', role: 'reload' },
                    { type: 'separator' },
                    { label: 'Save', click: save },
                    { label: 'Save As', click: saveas },
                    { type: 'separator' },
                    { label: 'Exit', click: app.quit }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', click: toggleDevTools }
                ]
            }
            // Add more menu items as needed
        ];

        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);

        this.window.setMenu(menu);

        this.window.loadFile('./dist/html/index.html');

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

    serialize(type) {
        switch (type) {
            case "docx":
            //
            case "txt":
            //
            case "pdf":
            //
            case "":
            //
        }
    }

    deserialize() {
        let filetype = this.filename.split(".")[this.filename.split(".").length - 1];
        switch (type) {
            case "docx":
            //
            case "txt":
            //
            case "pdf":
            //
            case "":
            //
        }
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
        this.content = [Element];
        this.visuals = [String];
        this.name = name;
    }

    update() {
        this.visuals = [String];
        for (const e of this.content) {
            this.visuals.push(e.createVisuals());
        }
        // Refresh the visuals using the updated backend information
    }
}

ipcMain.on("page-refresh::set-timeout", (event, ...args) => {

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



const graphicsWindow = new GraphicsWindow();
const notebook = new Notebook();