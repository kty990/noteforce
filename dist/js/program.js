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

}

main();
