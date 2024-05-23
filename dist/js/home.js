const filemenu = document.getElementById("file");
const file_options = document.getElementById("file-options");

const insertmenu = document.getElementById("insert");
const insert_options = document.getElementById("insert-options");
const insertURL = document.getElementById("url");

let sidebar = document.getElementById("notepads").querySelector("#contents");

const notifContainer = document.getElementById("notification-container");

const links = {};
let linkCount = 0;

let currentHue = 0;

const new_notepad = document.getElementById("new-notepad");
const new_notepad_file = document.getElementById("new-notepad-file");
const notepads = document.getElementById("contents");

const textarea = document.getElementById("textarea");
let selectedNotepad = { element: null, name: null };
const save = document.getElementById("save");

const gradient = document.getElementById("gradient");
const hueSelect = document.getElementById("hue-select");
const colorValueDisplay = document.getElementById("colorValue");
const selector = document.getElementById("selector");
const preview = document.getElementById("preview");

{
    function newNotepad(name) {
        let e = document.createElement("p");
        e.classList.add("notepad-button");
        e.textContent = name;
        return e;
        // return `<p class='notepad-button'>${name}</p>`
    }

    function LoadListener(sideTemplate) {
        sideTemplate.addEventListener("click", () => {
            try {
                selectedNotepad.element.style.backgroundColor = null;
            } catch (e) { console.log(e) }
            selectedNotepad.element = sideTemplate;
            selectedNotepad.name = sideTemplate.textContent;
            selectedNotepad.element.style.backgroundColor = 'var(--interaction)'
            window.api.send("notepadSelected", selectedNotepad.name);
        })
    }

    insertURL.addEventListener("click", async () => {
        let w = await newPopupWindow(300, 300);
        w = adjustPopup(w, 2);
        document.body.appendChild(w);
        w.querySelector(".button").addEventListener("click", () => {
            let url = w.querySelector("#content").querySelector("#url").value;
            console.log(w.querySelector("#content").querySelector("#url").value);
            if (url.length > 0) {
                let link = loadURL_Link(url, w.querySelector("#content").querySelector("#display").value);
                link.addEventListener("click", e => {
                    // Open in default browser, or in popup iframe
                    window.api.send("open_url", url);
                })
                textarea.appendChild(link);
                w.remove();
            }
        })
    })

    filemenu.addEventListener("click", () => {
        insert_options.style.visibility = 'hidden';
        file_options.style.visibility = (file_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
    })

    insertmenu.addEventListener("click", () => {
        file_options.style.visibility = 'hidden';
        insert_options.style.visibility = (insert_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
    })

    save.addEventListener("click", async () => {
        let result = await window.api.invoke("save", { content: textarea.innerHTML, notepad: selectedNotepad.name });
        let notif = newNotification((result) ? "Success" : "Error", (result) ? `${selectedNotepad.name} saved successfully!` : `Error saving ${selectedNotepad.name}`, (result) ? undefined : '#7d0000');
        addNotification(notif);
    })

    async function addNotepad() {
        // Display a popup window (as a div, not an actual new window) to get the name of the notepad.
        let w = await newPopupWindow();
        w = adjustPopup(w);

        w.querySelector(".button").addEventListener("click", async () => {
            let name = w.querySelector("input").value;
            if (name.length > 0) {
                await window.api.invoke("newNotepad", name);
                let template = newNotepad(name);
                LoadListener(template);
                sidebar.appendChild(template);
                let notif = newNotification(`Notepad Created!`, `${name} created`);
                addNotification(notif);
            }
            w.remove();
        })

        document.body.appendChild(w);
    }

    new_notepad.addEventListener("click", () => {
        addNotepad();
    })

    new_notepad_file.addEventListener("click", () => {
        addNotepad();
    })


    async function newPopupWindow(width = 300, height = 200) {
        return new Promise((resolve) => {
            let w = document.createElement("div");
            w.classList.add("popup");
            w.style.width = `${width}px`;
            w.style.height = `${height}px`;
            w.style.left = `calc(50% - ${width / 2}px)`;
            w.style.top = `calc(45% - ${height / 2}px)`;
            let content = document.createElement("div");
            content.id = "content";
            w.appendChild(content);
            resolve(w);
        })
    }

    function adjustPopup(w, mode = 1) {
        switch (mode) {
            case 1:
                // New notepad
                let p = document.createElement("p");
                p.style.margin = '0';
                p.style.marginLeft = 'auto';
                p.style.marginRight = 'auto';
                p.textContent = 'SELECT A NAME'
                p.style.fontSize = '25px';
                p.style.fontWeight = 'bold';
                p.style.marginBottom = '20px';


                let name = document.createElement("input");
                name.style.backgroundColor = "var(--interaction)";
                name.style.width = "70%";
                name.style.height = "30px";
                name.style.position = "relative";
                name.style.margin = '0';
                // name.style.top = '30%';
                name.style.marginLeft = 'auto';
                name.style.marginRight = 'auto';
                name.style.textAlign = 'center';
                name.style.outline = 'unset';
                name.style.color = 'var(--text)';
                name.style.borderColor = 'var(--border)';
                name.style.borderStyle = 'solid';
                name.style.marginBottom = '20px';

                let submit = document.createElement("div");
                submit.classList.add('button');
                submit.innerHTML = 'Submit';

                w.querySelector("#content").style.display = 'flex';
                w.querySelector("#content").style.flexDirection = 'column';
                w.style.borderStyle = 'solid';
                w.style.borderColor = 'var(--border)';
                w.querySelector("#content").appendChild(p);
                w.querySelector("#content").appendChild(name);
                w.querySelector("#content").appendChild(submit);
                return w;
            case 2:
                // New URL
                let pp = document.createElement("p");
                pp.style.margin = '0';
                pp.style.marginLeft = 'auto';
                pp.style.marginRight = 'auto';
                pp.textContent = 'ENTER A URL'
                pp.style.fontSize = '25px';
                pp.style.fontWeight = 'bold';
                pp.style.marginBottom = '20px';

                let url = document.createElement("input");
                url.style.backgroundColor = "var(--interaction)";
                url.style.width = "70%";
                url.style.height = "30px";
                url.style.position = "relative";
                url.style.margin = '0';
                // name.style.top = '30%';
                url.style.marginLeft = 'auto';
                url.style.marginRight = 'auto';
                url.style.textAlign = 'center';
                url.style.outline = 'unset';
                url.style.color = 'var(--text)';
                url.style.borderColor = 'var(--border)';
                url.style.borderStyle = 'solid';
                url.id = 'url';
                url.style.marginBottom = '5px';

                let displayName = document.createElement("p");
                displayName.style.margin = '0';
                displayName.style.marginLeft = 'auto';
                displayName.style.marginRight = 'auto';
                displayName.textContent = 'DISPLAY NAME'
                displayName.style.fontSize = '25px';
                displayName.style.fontWeight = 'bold';
                displayName.style.marginBottom = '20px';

                let display = document.createElement("input");
                display.style.backgroundColor = "var(--interaction)";
                display.style.width = "70%";
                display.style.height = "30px";
                display.style.position = "relative";
                display.style.margin = '0';
                // name.style.top = '30%';
                display.style.marginLeft = 'auto';
                display.style.marginRight = 'auto';
                display.style.textAlign = 'center';
                display.style.outline = 'unset';
                display.style.color = 'var(--text)';
                display.style.borderColor = 'var(--border)';
                display.style.borderStyle = 'solid';
                display.style.marginBottom = '20px';
                display.id = 'display';

                let s = document.createElement("div");
                s.classList.add('button');
                s.innerHTML = 'Submit';

                w.querySelector("#content").style.display = 'flex';
                w.querySelector("#content").style.flexDirection = 'column';
                w.style.borderStyle = 'solid';
                w.style.borderColor = 'var(--border)';
                w.querySelector("#content").appendChild(pp);
                w.querySelector("#content").appendChild(url);
                w.querySelector("#content").appendChild(displayName);
                w.querySelector("#content").appendChild(display);
                w.querySelector("#content").appendChild(s);
                return w;
        }
    }

    function loadURL_Link(url, displayName) {
        links[++linkCount] = url;
        let link = document.createElement("a");
        link.href = url;
        link.textContent = displayName;
        link.id = linkCount;
        link.classList.add('link');
        link.contentEditable = 'false';
        return link;
        // return `<a href="${url}" class='link'>${url}</a>` // might need to change method
    }

    window.api.on("load_html", html => { // Not implemented on server side
        textarea.innerHTML = html;
    })

    window.api.on("AddToSideMenu", name => {
        console.log("Attempting to load from save: ", name);
        let note = newNotepad(name);
        LoadListener(note);
        sidebar.appendChild(note);
    })

}

function newNotification(title = "", description = "", color = "var(--interaction)") {
    let container = document.createElement("div");
    container.classList.add("notification");
    let t = document.createElement("p");
    t.textContent = title;
    t.id = 'title';
    t.style.backgroundColor = color;
    let d = document.createElement("p");
    d.textContent = description;
    d.id = 'description';
    container.appendChild(t);
    container.appendChild(d);
    return container;
}

function addNotification(notification, lifetime = 3000) {
    return new Promise((resolve, reject) => {
        try {
            notifContainer.appendChild(notification);
            setTimeout(() => {
                notification.remove();
                resolve();
            }, lifetime)
        } catch (e) {
            reject(e);
        }
    })
}

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        let result = await window.api.invoke("save", { content: textarea.innerHTML, notepad: selectedNotepad.name });
        let notif = newNotification((result) ? "Success" : "Error", (result) ? `${selectedNotepad.name} saved successfully!` : `Error saving ${selectedNotepad.name}`, (result) ? undefined : '#7d0000');
        addNotification(notif);
    } else if (event.ctrlKey && event.key == 'n') {
        addNotepad().catch(() => { });
    }
});
function hslToRgb(h, s, l) {
    // Normalize the hue to be between 0 and 360
    h = h % 360;
    if (h < 0) h += 360;

    // Normalize the saturation and lightness to be between 0 and 1
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        // Achromatic (grey)
        r = g = b = l;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h / 360 + 1 / 3);
        g = hueToRgb(p, q, h / 360);
        b = hueToRgb(p, q, h / 360 - 1 / 3);
    }

    // Convert the results to the range 0-255 and return
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function createGradient(hue) {



    let ctx = gradient.getContext('2d');
    for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
            // row.push({ h: hue, s: x, l: y });
            const light = y / 2; //x > 50 &&
            const sat = x;
            const { r, g, b } = hslToRgb(hue, sat, light);
            // console.log(r, g, b);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, 100 - y, 1, 1);
        }
    }

}

function createHueRange(canvas, line = 0) {
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const step = width / 360; // Pixel width per hue value

    for (let x = 0; x < width; x++) {
        const hue = (x / step) % 360; // Calculate hue value based on x position
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; // Set fill style with current hue
        ctx.fillRect(x, 0, step, height); // Fill rectangle with current color
    }

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(line, 0, 2, height);
}
function rgbToHex(r, g, b) {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
createHueRange(hueSelect, 0);
createGradient(0);


hueSelect.addEventListener("click", e => {
    let newHue = (e.offsetX / 100) * 360;
    currentHue = newHue;
    // Display line showing where the hue is
    createGradient(newHue);
    createHueRange(hueSelect, (newHue / 360) * hueSelect.width);
    console.log(newHue);
})

gradient.addEventListener("click", e => {
    //     const light = y / 2; //x > 50 &&
    //     const sat = x;
    //     const { r, g, b } = hslToRgb(hue, sat, light);
    console.log(e);
    let color = hslToRgb(currentHue, e.offsetX, (100 - e.offsetY) / 2);
    console.log(color, e.xOffset);
    colorValueDisplay.textContent = rgbToHex(color.r, color.g, color.b);
    preview.style.backgroundColor = colorValueDisplay.textContent;

    let ctx = gradient.getContext("2d");
    ctx.clearRect(0, 0, gradient.width, gradient.height);
    createGradient(currentHue);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, e.offsetY - 0.5, 100, 1);
    ctx.fillRect(e.offsetX - 0.5, 0, 1, 100);
})

color.addEventListener("click", (e) => {
    console.log(e);
    if (e.srcElement.id == "package" || e.srcElement.id == "color" || e.srcElement.id == "colorValue" || e.srcElement.id == "preview") {
        selector.style.display = (selector.style.display == 'none') ? 'block' : 'none';
    }
})