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

new_notepad.addEventListener("click", () => {
    // Display a popup window (as a div, not an actual new window) to get the name of the notepad.
})