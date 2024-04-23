const filemenu = document.getElementById("file-menu");
const file_options = document.getElementById("file-options");

const insertmenu = document.getElementById("insert-menu");
const insert_options = document.getElementById("insert-options");


filemenu.addEventListener("click", () => {
    insert_options.style.visibility = 'hidden';
    file_options.style.visibility = (file_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
})

insertmenu.addEventListener("click", () => {
    file_options.style.visibility = 'hidden';
    insert_options.style.visibility = (insert_options.style.visibility == 'hidden') ? 'visible' : 'hidden';
})