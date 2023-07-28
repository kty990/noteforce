console.log = (function (old) {
    return (text) => {
        old(text);
    }
}(console.log.bind(console)));

async function main() {
    window.api.on("page-refresh", (page) => {
        let visuals = page.visuals;
        for (const v of visuals) {
            // Edit the display
        }
    })

    window.api.send("page-refresh::set-timeout", 60000); // 60 seconds for auto-refresh

    let sbElement = document.getElementById("replacewithsidebar");

    if (sbElement) {
        await fetch("../html/sidebar.html")
            .then((res) => res.text())
            .then((text) => {
                let div = document.createElement("div");
                div.innerHTML = text;
                div.id = "SIDEBAR_DEBUG_VIEW"
                document.body.appendChild(div);
                sbElement.remove();
            })
            .catch((e) => console.error(e));
    }

    let e = document.getElementById("first").querySelector("p");
    if (e) {
        e.addEventListener("click", async () => {
            let newNote = await window.api.invoke("NewNote");
            let ee = document.getElementById("notepads");
            let div = document.createElement("div");
            div.classList.add("notepad");
            let p = document.createElement("p");
            p.textContent = newNote.name;
            div.appendChild(p);
            ee.appendChild(div);
        })
    }

}

main().then(() => {
    let x = document.getElementById("close");
    let mm = document.getElementById("minimize");

    console.log(`x:${x}\n_: ${mm}`);

    x.addEventListener("click", () => {
        window.api.send("close");
    })

    mm.addEventListener("click", () => {
        window.api.send("minimize");
    })
}).catch((e) => {
    console.error(e);
});

window.onresize = function () {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    document.documentElement.style.setProperty('--vwh', Math.min(vw, vh));
}

document.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey && ev.key.toLowerCase() === "r") {
        window.api.send("dev-refresh");
    } else if (ev.ctrlKey && ev.key.toLowerCase() == "t") {
        window.api.send("toggle-dev-tools");
    }
});