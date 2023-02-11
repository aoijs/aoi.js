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

                console.warn(
                    "\x1b[31mAoiWarning: \u001b[33mYou are currently using an outdated version, install the latest version by" +
                    "\u001b[0m" + " (\x1b[31mnpm i aoi.js@latest\x1b[0m)")
            }
        } catch {
        }
    }
}