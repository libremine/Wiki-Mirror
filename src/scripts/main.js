const base = "https://mulverinex.github.io/Wiki-Mirror/";
//@ts-check
function load_page(pageID) {
    console.log(`Loading page ${pageID}`);
    const request_url = `https://minecraft.gamepedia.com/api.php?origin=*&action=parse&page=${pageID}&format=json&redirects=true`;
    const s = fetch(request_url)
        .then(r => r.json()).catch(e => {
            /* Handle error gracefully */
        }).then(r => {
            console.log(r);
            if (r.parse) {
                if (r.parse.text && r.parse.text["*"]) {
                    const text = r.parse.text["*"].replace(
                        /* Replace absolute relative urls (e.g. /1.13.2) with relative style urls affected by the 'base' element (i.e. 1.13.2) */
                        /href\s*=\s*"\//g, `href=\"${base}`
                    );
                    document.getElementById("content").innerHTML = text;
                }
                document.getElementById("page-title").textContent = r.parse.title;
                document.getElementById("page-link").href = `https://minecraft.gamepedia.com/${pageID}`;
                document.getElementById("page-link").textContent = "[Source]";
            }
        });
}
window.addEventListener("load", e => {
    if (document.URL.startsWith(base)) {
        const page = document.URL.substr(base.length);
        load_page(page);
    } else {
        const url = new URL(document.URL);
        load_page(url.pathname.substr(1)); // Exclude initial `/`
    }
});