const uglify = require("uglify-js");
const csso = require("csso");
const path = require("path");

const fs = require("fs");
const AoijsPkg = require("../package.json");
const docPath = "./api_docs/src/pages/docs/";
const base = path.resolve(process.cwd(), docPath);

const files = fs.readdirSync(base);

function walk(base) {
    const files = fs.readdirSync(base);
    for (const fileordir of files) {
        const fsStats = fs.statSync(path.join(base, fileordir));
        if (fsStats.isDirectory()) {
            walk(path.join(base, fileordir));
        } else {
            if (!fileordir.endsWith(".html")) continue;

            const content = fs.readFileSync(
                path.join(base, fileordir),
                "utf-8",
            );
            // fixing all the relative links
            const replaced = content
                // replace href to tho anchors which are in the same page in format of SamePage.html#anchor
                .replace(/href=".+?\.html#.+?"/g, (match) => {
                     console.log(match);
                    if (match.startsWith('href="/')) return match;
                    if (match.startsWith('href="#')) return match;
                    if (match.startsWith('href="https://')) return match;
                    if (match.startsWith('href="http://')) return match;
                    if (match.startsWith('href="../'))
                        return `href="/docs/${match
                            .replaceAll("../", "")
                            .slice(6)}`.replaceAll(".html", "");
                    const category = base.split("/").pop();
                    //console.log(match);
                    return `href="/docs/${category}/${match.slice(6)}`.replaceAll(".html", "");
                })
                .replace(/src=".*?"/g, (match) => {
                    if (match.startsWith('src="/')) return match;
                    if (match.startsWith('src="https://')) return match;
                    if (match.startsWith('src="http://')) return match;
                    if (match.startsWith('src="../'))
                        return `src="/${match
                            .replaceAll("../", "")
                            .slice(5)}`;
                    if (match.startsWith('src="./')) {
                        return `src="/${match
                            .replaceAll("./", "")
                            .slice(5)}`;
                    }
                    return `src="/${match.slice(5)}`;
                })
                .replace(/href=".*?"/g, (match) => {
                    if (match.startsWith('href="/')) return match;
                    if (match.startsWith('href="#')) return match;
                    if (match.startsWith('href="https://')) return match;
                    if (match.startsWith('href="http://')) return match;
                    if (
                        ['.css"', '.png"', '.jpg"', '.jpeg"'].some((e) =>
                            match.endsWith(e),
                        )
                    ) {
                        console.log(match);
                        if (match.startsWith('href="../'))
                            return `href="/${match
                                .replaceAll("../", "")
                                .slice(6)}`;
                        else if (match.startsWith('href="./')) {
                            return `href="/${match
                                .replaceAll("./", "")
                                .slice(6)}`;
                        } else return `href="/${match.slice(6)}`;
                    }
                    if (match.startsWith('href="../'))
                        return `href="/docs/${match
                            .replaceAll("../", "")
                            .slice(6)}`.replaceAll(".html", "");
                    const category = base.split("/").pop();
                    if (category === AoijsPkg.version)
                        return `href="/docs/${match.slice(6)}`.replaceAll(".html", "");
                    return `href="/docs/${category}/${match.slice(6)}`.replaceAll(".html", "");
                })
                .replace(
                    `<header class="tsd-page-toolbar">
<div class="tsd-toolbar-contents container">
<div class="table-cell" id="tsd-search" data-base=".">
<div class="field"><label for="tsd-search-field" class="tsd-widget tsd-toolbar-icon search no-caption"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.7824 13.833L12.6666 10.7177C12.5259 10.5771 12.3353 10.499 12.1353 10.499H11.6259C12.4884 9.39596 13.001 8.00859 13.001 6.49937C13.001 2.90909 10.0914 0 6.50048 0C2.90959 0 0 2.90909 0 6.49937C0 10.0896 2.90959 12.9987 6.50048 12.9987C8.00996 12.9987 9.39756 12.4863 10.5008 11.6239V12.1332C10.5008 12.3332 10.5789 12.5238 10.7195 12.6644L13.8354 15.7797C14.1292 16.0734 14.6042 16.0734 14.8948 15.7797L15.7793 14.8954C16.0731 14.6017 16.0731 14.1267 15.7824 13.833ZM6.50048 10.499C4.29094 10.499 2.50018 8.71165 2.50018 6.49937C2.50018 4.29021 4.28781 2.49976 6.50048 2.49976C8.71001 2.49976 10.5008 4.28708 10.5008 6.49937C10.5008 8.70852 8.71314 10.499 6.50048 10.499Z" fill="var(--color-text)"></path></svg></label><input type="text" id="tsd-search-field" aria-label="Search"/></div>
<div class="field">
<div id="tsd-toolbar-links"></div></div>
<ul class="results">
<li class="state loading">Preparing search index...</li>
<li class="state failure">The search index is not available</li></ul><a href="/" class="title">aoijs - v1.0.0-dev</a></div>
<div class="table-cell" id="tsd-widgets"><a href="#" class="tsd-widget tsd-toolbar-icon menu no-caption" data-toggle="menu" aria-label="Menu"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="7" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="11" width="14" height="2" fill="var(--color-text)"></rect></svg></a></div></div></header>`,
                    `<header class="tsd-page-toolbar">
<div class="tsd-toolbar-contents container">
<div class="table-cell" id="tsd-search" data-base=".">
<div class="field"><label for="tsd-search-field" class="tsd-widget tsd-toolbar-icon search no-caption"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.7824 13.833L12.6666 10.7177C12.5259 10.5771 12.3353 10.499 12.1353 10.499H11.6259C12.4884 9.39596 13.001 8.00859 13.001 6.49937C13.001 2.90909 10.0914 0 6.50048 0C2.90959 0 0 2.90909 0 6.49937C0 10.0896 2.90959 12.9987 6.50048 12.9987C8.00996 12.9987 9.39756 12.4863 10.5008 11.6239V12.1332C10.5008 12.3332 10.5789 12.5238 10.7195 12.6644L13.8354 15.7797C14.1292 16.0734 14.6042 16.0734 14.8948 15.7797L15.7793 14.8954C16.0731 14.6017 16.0731 14.1267 15.7824 13.833ZM6.50048 10.499C4.29094 10.499 2.50018 8.71165 2.50018 6.49937C2.50018 4.29021 4.28781 2.49976 6.50048 2.49976C8.71001 2.49976 10.5008 4.28708 10.5008 6.49937C10.5008 8.70852 8.71314 10.499 6.50048 10.499Z" fill="var(--color-text)"></path></svg></label><input type="text" id="tsd-search-field" aria-label="Search"/></div>
<div class="field">
<div id="tsd-toolbar-links"></div></div>
<ul class="results">
<li class="state loading">Preparing search index...</li>
<li class="state failure">The search index is not available</li></ul><a href="/" class="title">Home</a><a href="#" onclick="window.location.href = window.location.href.split('/').slice(0,6).join('/'); return false;" class="title">Intro</a><a href="/soon" class="title">Guide</a></div>
<div class="table-cell" id="tsd-widgets"><a href="#" class="tsd-widget tsd-toolbar-icon menu no-caption" data-toggle="menu" aria-label="Menu"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="7" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="11" width="14" height="2" fill="var(--color-text)"></rect></svg></a></div></div></header>


<div class="cursor" id="c1"></div>
<div class="cursor2" id="c2"></div>

<style>
    .cursor {
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 100%;
        position: fixed;
        transition: 500ms ease;
        transition-property: width, height, background-color;
        pointer-events: none;
        z-index: 999;
        mix-blend-mode: exclusion;
        top:0;
        left:0;
    }

    .cursor2 {
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: 2px solid #f492f0;
        border-radius: 100%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        position: fixed;
        transition: 500ms ease;
        transition-property: width, height, border;
        pointer-events: none;
        z-index: 999;
        top:0;
        left:0;
        mix-blend-mode: exclusion;
    }

    .cursor2.active {
        width: 60px;
        height: 60px;
        border: 2px solid white;
    }

    .cursor.active {
        width: 40px;
        height: 40px;
        background-color: #f492f0;
    }
</style>

<script>
    const cursor1 = document.getElementById("c1");
    const cursor2 = document.getElementById("c2");

    document.onmousemove = (e) => {
        if (!cursor1 || !cursor2) return;
        const cursor1Height = cursor1?.offsetHeight ?? 20;
        const cursor1Width = cursor1?.offsetWidth ?? 20;

        const cursor2Height = cursor2?.offsetHeight ?? 40;
        const cursor2Width = cursor2?.offsetWidth ?? 40;

        setTimeout(() => {
            cursor1.style.transform = \`translateX(\${
                e.clientX - cursor1Width / 2
            }px) translateY(\${e.clientY - cursor1Height / 2}px)\`;
        }, 50);

        setTimeout(() => {
            cursor2.style.transform = \`translateX(\${
                e.clientX - cursor2Width / 2
            }px) translateY(\${e.clientY - cursor2Height / 2}px)\`;
        }, 100);
        if (e.target?.tagName === "A" || e.target?.tagName === "BUTTON" || e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA" || e.target?.tagName === "IMG" || e.target.tagName === "svg" || e.target.tagName === "CODE" || e.target.classList.contains("cursor-pointer") || e.target?.parentElement?.tagName === "A" || e.target?.parentElement?.tagName === "BUTTON" || e.target?.parentElement?.tagName === "INPUT" || e.target?.parentElement?.tagName === "TEXTAREA" || e.target?.parentElement?.tagName === "IMG" || e.target?.parentElement?.tagName === "svg" || e.target?.parentElement?.tagName === "CODE" || e.target?.parentElement?.classList.contains("cursor-pointer")) {
            cursor1.classList.add("active");
            cursor2.classList.add("active");
        } else {
            cursor1.classList.remove("active");
            cursor2.classList.remove("active");
        }
    }

        document.onmousedown = () => {
        cursor1.classList.add("active");
        cursor2.classList.add("active");
    };
    document.onmouseup = () => {
        cursor1.classList.remove("active");
        cursor2.classList.remove("active");
    };

        /* remove the cursor for mobile */

    if (window.innerWidth < 768) {
        cursor1?.remove();
        cursor2?.remove();

        document.onmousemove = null;
        document.onmousedown = null;
        document.onmouseup = null;
    }
</script>`,
                )
                .replace(
                    `<header class="tsd-page-toolbar">
<div class="tsd-toolbar-contents container">
<div class="table-cell" id="tsd-search" data-base="..">
<div class="field"><label for="tsd-search-field" class="tsd-widget tsd-toolbar-icon search no-caption"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.7824 13.833L12.6666 10.7177C12.5259 10.5771 12.3353 10.499 12.1353 10.499H11.6259C12.4884 9.39596 13.001 8.00859 13.001 6.49937C13.001 2.90909 10.0914 0 6.50048 0C2.90959 0 0 2.90909 0 6.49937C0 10.0896 2.90959 12.9987 6.50048 12.9987C8.00996 12.9987 9.39756 12.4863 10.5008 11.6239V12.1332C10.5008 12.3332 10.5789 12.5238 10.7195 12.6644L13.8354 15.7797C14.1292 16.0734 14.6042 16.0734 14.8948 15.7797L15.7793 14.8954C16.0731 14.6017 16.0731 14.1267 15.7824 13.833ZM6.50048 10.499C4.29094 10.499 2.50018 8.71165 2.50018 6.49937C2.50018 4.29021 4.28781 2.49976 6.50048 2.49976C8.71001 2.49976 10.5008 4.28708 10.5008 6.49937C10.5008 8.70852 8.71314 10.499 6.50048 10.499Z" fill="var(--color-text)"></path></svg></label><input type="text" id="tsd-search-field" aria-label="Search"/></div>
<div class="field">
<div id="tsd-toolbar-links"></div></div>
<ul class="results">
<li class="state loading">Preparing search index...</li>
<li class="state failure">The search index is not available</li></ul><a href="/" class="title">aoijs - v1.0.0-dev</a></div>
<div class="table-cell" id="tsd-widgets"><a href="#" class="tsd-widget tsd-toolbar-icon menu no-caption" data-toggle="menu" aria-label="Menu"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="7" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="11" width="14" height="2" fill="var(--color-text)"></rect></svg></a></div></div></header>`,
                    `<header class="tsd-page-toolbar">
<div class="tsd-toolbar-contents container">
<div class="table-cell" id="tsd-search" data-base=".">
<div class="field"><label for="tsd-search-field" class="tsd-widget tsd-toolbar-icon search no-caption"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.7824 13.833L12.6666 10.7177C12.5259 10.5771 12.3353 10.499 12.1353 10.499H11.6259C12.4884 9.39596 13.001 8.00859 13.001 6.49937C13.001 2.90909 10.0914 0 6.50048 0C2.90959 0 0 2.90909 0 6.49937C0 10.0896 2.90959 12.9987 6.50048 12.9987C8.00996 12.9987 9.39756 12.4863 10.5008 11.6239V12.1332C10.5008 12.3332 10.5789 12.5238 10.7195 12.6644L13.8354 15.7797C14.1292 16.0734 14.6042 16.0734 14.8948 15.7797L15.7793 14.8954C16.0731 14.6017 16.0731 14.1267 15.7824 13.833ZM6.50048 10.499C4.29094 10.499 2.50018 8.71165 2.50018 6.49937C2.50018 4.29021 4.28781 2.49976 6.50048 2.49976C8.71001 2.49976 10.5008 4.28708 10.5008 6.49937C10.5008 8.70852 8.71314 10.499 6.50048 10.499Z" fill="var(--color-text)"></path></svg></label><input type="text" id="tsd-search-field" aria-label="Search"/></div>
<div class="field">
<div id="tsd-toolbar-links"></div></div>
<ul class="results">
<li class="state loading">Preparing search index...</li>
<li class="state failure">The search index is not available</li></ul><a href="/" class="title">Home</a><a href="#" onclick="window.location.href = window.location.href.split('/').slice(0,6).join('/'); return false;" class="title">Intro</a><a href="/soon" class="title">Guide</a></div>
<div class="table-cell" id="tsd-widgets"><a href="#" class="tsd-widget tsd-toolbar-icon menu no-caption" data-toggle="menu" aria-label="Menu"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="7" width="14" height="2" fill="var(--color-text)"></rect><rect x="1" y="11" width="14" height="2" fill="var(--color-text)"></rect></svg></a></div></div></header>


<div class="cursor" id="c1"></div>
<div class="cursor2" id="c2"></div>

<style>
    .cursor {
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 100%;
        position: fixed;
        transition: 500ms ease;
        transition-property: width, height, background-color;
        pointer-events: none;
        z-index: 999;
        mix-blend-mode: exclusion;
        top:0;
        left:0;
    }

    .cursor2 {
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: 2px solid #f492f0;
        border-radius: 100%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        position: fixed;
        transition: 500ms ease;
        transition-property: width, height, border;
        pointer-events: none;
        z-index: 999;
        top:0;
        left:0;
        mix-blend-mode: exclusion;
    }

    .cursor2.active {
        width: 60px;
        height: 60px;
        border: 2px solid white;
    }

    .cursor.active {
        width: 40px;
        height: 40px;
        background-color: #f492f0;
    }
</style>

<script>
    const cursor1 = document.getElementById("c1");
    const cursor2 = document.getElementById("c2");

    document.onmousemove = (e) => {
        if (!cursor1 || !cursor2) return;
        const cursor1Height = cursor1?.offsetHeight ?? 20;
        const cursor1Width = cursor1?.offsetWidth ?? 20;

        const cursor2Height = cursor2?.offsetHeight ?? 40;
        const cursor2Width = cursor2?.offsetWidth ?? 40;

        setTimeout(() => {
            cursor1.style.transform = \`translateX(\${
                e.clientX - cursor1Width / 2
            }px) translateY(\${e.clientY - cursor1Height / 2}px)\`;
        }, 50);

        setTimeout(() => {
            cursor2.style.transform = \`translateX(\${
                e.clientX - cursor2Width / 2
            }px) translateY(\${e.clientY - cursor2Height / 2}px)\`;
        }, 100);
        if (e.target?.tagName === "A" || e.target?.tagName === "BUTTON" || e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA" || e.target?.tagName === "IMG" || e.target.tagName === "svg" || e.target.tagName === "CODE" || e.target.classList.contains("cursor-pointer") || e.target?.parentElement?.tagName === "A" || e.target?.parentElement?.tagName === "BUTTON" || e.target?.parentElement?.tagName === "INPUT" || e.target?.parentElement?.tagName === "TEXTAREA" || e.target?.parentElement?.tagName === "IMG" || e.target?.parentElement?.tagName === "svg" || e.target?.parentElement?.tagName === "CODE" || e.target?.parentElement?.classList.contains("cursor-pointer")) {
            cursor1.classList.add("active");
            cursor2.classList.add("active");
        } else {
            cursor1.classList.remove("active");
            cursor2.classList.remove("active");
        }
    };

        document.onmousedown = () => {
        cursor1.classList.add("active");
        cursor2.classList.add("active");
    };
    document.onmouseup = () => {
        cursor1.classList.remove("active");
        cursor2.classList.remove("active");
    };

        /* remove the cursor for mobile */

    if (window.innerWidth < 768) {
        cursor1?.remove();
        cursor2?.remove();

        document.onmousemove = null;
        document.onmousedown = null;
        document.onmouseup = null;
    }
</script>
`,
                );

            fs.writeFileSync(path.join(base, fileordir), replaced);
        }
    }
}

function moveAssets() {
    const assetsPath = path.resolve(
        process.cwd(),
        `./api_docs/src/pages/docs/assets`,
    );
    const newAssetsPath = path.resolve(process.cwd(), "./api_docs/public/assets");

    if (!fs.existsSync(newAssetsPath)) fs.mkdirSync(newAssetsPath);

    const files = fs.readdirSync(assetsPath);

    for (const file of files) {
        let content = fs.readFileSync(path.join(assetsPath, file)).toString();

        if (file === "search.js") {
            content = content.replaceAll(".html", "");
        } else if (file === "main.js") {
            content = content.replace(
                "m.href=n.base+l.url",
                `m.href= "/"+window.location.href.split("/").slice(3,6).join("/")+"/"+l.url`,
            );
        }
        let minified;
        if (file.endsWith(".css")) {
            minified = csso.minify(content).css;
        } else if (file.endsWith(".js")) minified = uglify.minify(content).code;
        else minified = content;
        fs.writeFileSync(path.join(newAssetsPath, file), minified ?? "");
    }

    fs.rmSync(assetsPath, { recursive: true });

    const mycss = fs.readFileSync(__dirname + "/custom.css").toString();

    fs.appendFileSync(path.join(newAssetsPath, "custom.css"), mycss);
}

walk(base);
moveAssets();
