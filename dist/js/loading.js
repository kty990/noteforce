const logo = document.getElementById("loading-logo");
const logotext = document.getElementById("logotext");
const default_w = 4096;
const default_h = 4096;
let currentDashOffset = 1000; // Initial dash offset for animation

function setSize() {
    logo.setAttribute("viewBox", `0 0 ${(window.innerWidth / default_w * 100) + 50} ${(window.innerHeight / default_h * 100) + 50}`);
    const w = (window.innerWidth / default_w * 100);
    const h = (window.innerHeight / default_h * 100);
    logo.setAttribute("width", `${w}`);
    logo.setAttribute("height", `${h}`);
    logo.setAttribute("transform", `translate(${(window.innerWidth / 2) - (w / 2)},${(window.innerHeight / 2) - (h / 2)})`)
    for (let child of logo.children) {
        let value = `scale( ${1 / (window.innerWidth / w)}, ${1 / (window.innerHeight / h)})`
        console.log(value);
        child.setAttribute("transform", value);
    }
}

window.addEventListener("resize", e => {
    setSize();
})

setSize();


const action = (i) => {
    return new Promise((resolve, reject) => {
        logotext.textContent = "NoteForce".substring(0, i + 1);
        setTimeout(() => {
            resolve();
        }, 300);
    })
}

const subaction = () => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            for (let i = 0; i < "Noteforce".length; i++) {
                await action(i);
            }
            resolve();
        }, 1000);
    })
}

const mainaction = async () => {
    for (let i = 0; i < 5; i++) {
        await subaction();
    }
    window.api.send("loaded");
}

mainaction();