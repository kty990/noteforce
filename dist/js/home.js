const filemenu = document.getElementById("file");
const file_options = document.getElementById("file-options");

const insertmenu = document.getElementById("insert");
const insert_options = document.getElementById("insert-options");
const insertURL = document.getElementById("url");

let sidebar = document.getElementById("notepads").querySelector("#contents");

const links = {};
let linkCount = 0;

const new_notepad = document.getElementById("new-notepad");
const new_notepad_file = document.getElementById("new-notepad-file");
const notepads = document.getElementById("contents");

const textarea = document.getElementById("textarea");
let selectedNotepad = { element: null, name: null }; // Still have to do this
const save = document.getElementById("save");

function newNotepad(name) {
    return `<p class='notepad-button'>${name}</p>`
}

function LoadListener(sideTemplate) {
    sideTemplate.addEventListener("click", () => {
        try {
            selectedNotepad.element.style.backgroundColor = null;
        } catch (e) { }
        selectedNotepad.element = sideTemplate;
        selectedNotepad.name = selectedNotepad.textContent;
        window.api.send("notepadSelected", selectedNotepad.name);
    })
}

insertURL.addEventListener("click", async () => {
    let w = await newPopupWindow();
    w = adjustPopup(w, 2);
    document.body.appendChild(w);
    w.querySelector(".button").addEventListener("click", () => {
        let url = w.querySelector("#content").querySelector("input").value;
        console.log(w.querySelector("#content").querySelector("input").value);
        if (url.length > 0) {
            let link = loadURL_Link(url);
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

save.addEventListener("click", () => {
    window.api.send("save", { content: textarea.innerHTML, notepad: selectedNotepad.name });
})

async function addNotepad() {
    // Display a popup window (as a div, not an actual new window) to get the name of the notepad.
    let w = await newPopupWindow();
    w = adjustPopup(w);

    w.querySelector(".button").addEventListener("click", async () => {
        let name = w.querySelector("input").value;
        if (name.length > 0) {
            await window.api.invoke("newNotepad", name);
            let template = document.createElement("p");
            template.classList.add("notepad-button");
            template.textContent = name;
            LoadListener(template);
            sidebar.appendChild(template);
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
            // New notepad
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
            url.style.marginBottom = '20px';

            let s = document.createElement("div");
            s.classList.add('button');
            s.innerHTML = 'Submit';

            w.querySelector("#content").style.display = 'flex';
            w.querySelector("#content").style.flexDirection = 'column';
            w.style.borderStyle = 'solid';
            w.style.borderColor = 'var(--border)';
            w.querySelector("#content").appendChild(pp);
            w.querySelector("#content").appendChild(url);
            w.querySelector("#content").appendChild(s);
            return w;
    }
}

function loadURL_Link(url) {
    links[++linkCount] = url;
    let link = document.createElement("a");
    link.href = url;
    link.textContent = url;
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
    sidebar.innerHTML += note;
})