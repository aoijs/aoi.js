const {Agent, fetch} = require('undici');

const json = require("../../package.json");
module.exports = async (client) => {
    if (client.aoiOptions.aoiWarning !== false) {
        try {
            const res = await fetch('https://api.github.com/repos/AkaruiDevelopment/aoi.js/releases/latest', {
                dispatcher: new Agent({
                    keepAliveTimeout: 10,
                    keepAliveMaxTimeout: 10
                })
            })
            const data = (await res.json()).tag_name

            if (json.version !== data) {
                console.warn('\x1b[31mAoiWarning:\x1B[0m aoi.js is outdated! Update with "npm install aoi.js@latest".');
            }
        } catch {
        }
    }
}