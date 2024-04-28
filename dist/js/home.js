const filemenu = document.getElementById("file");
const file_options = document.getElementById("file-options");

const insertmenu = document.getElementById("insert");
const insert_options = document.getElementById("insert-options");

let sidebar = document.getElementById("notepads").querySelector("#contents");


const new_notepad = document.getElementById("new-notepad");
const notepads = document.getElementById("contents");

const textarea = document.getElementById("textarea");
let selectedNotepad = null; // Still have to do this
const save = document.getElementById("save");

function newNotepad(name) {
    return `<p class='notepad-button'>${name}</p>`
}


filemenu.addEventListener("click", () => {
    insert_options.style.visibility = 'hidden';
    file_options.style.visibility = (file_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
})

insertmenu.addEventListener("click", () => {
    file_options.style.visibility = 'hidden';
    insert_options.style.visibility = (insert_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
})

save.addEventListener("click", () => {
    window.api.send("save", { content: textarea.innerHTML, notepad: selectedNotepad });
})

new_notepad.addEventListener("click", async () => {
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
            sidebar.appendChild(template);
        }
        w.remove();
    })

    document.body.appendChild(w);
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
    }
}
