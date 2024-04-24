const filemenu = document.getElementById("file-menu");
const file_options = document.getElementById("file-options");

const insertmenu = document.getElementById("insert-menu");
const insert_options = document.getElementById("insert-options");


const new_notepad = document.getElementById("new-notepad");
const notepads = document.getElementById("contents");


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

new_notepad.addEventListener("click", async () => {
    // Display a popup window (as a div, not an actual new window) to get the name of the notepad.
    let window = await newPopupWindow();
    window = adjustPopup(window, 1);
    document.body.appendChild(window);
})






/** UNTESTED CODE */

async function newPopupWindow(width = 300, height = 200) {
    return new Promise((resolve) => {
        let w = document.createElement("div");
        w.classList.add("popup");
        w.style.width = `${width}px`;
        w.style.height = `${height}px`;
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
            let name = document.createElement("input");
            name.style.backgroundColor = "var(--interaction)";
            name.style.width = "70%";
            name.style.height = "30px";
            w.appendChild(name);
            return w;
    }
}
