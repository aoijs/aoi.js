const { request } = require('undici');

const json = require("../../package.json");
module.exports = async () => {
    try {
        const { body } = await request("https://api.leref.repl.co/package/version");
        const data = (await body.json()).version;

        if (json.version !== data) {

            console.warn(
                "\x1b[31mAoiWarning: \u001b[33mYou are currently using an outdated version, install the latest version by" +
                "\u001b[0m" + " (\x1b[31mnpm i aoi.js@latest\x1b[0m)")
        }
    } catch {
    }
};