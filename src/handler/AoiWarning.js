const {Agent, fetch} = require('undici');
const json = require("../../package.json");

module.exports = async (client) => {
    if (client.aoiOptions.aoiWarning !== false) {
        try {
            const res = await fetch('https://api.github.com/repos/AkaruiDevelopment/aoi.js/releases/latest', {
                dispatcher: new Agent({
                    keepAliveTimeout: 10000, // 10 seconds
                    keepAliveMaxTimeout: 15000 // 15 seconds
                }),
                headers: {
                    'User-Agent': 'aoi.js' // required by GitHub API
                }
            });

            const data = await res.json();

            if (json.version !== data.tag_name) {
                console.warn('\x1b[31mAoiWarning:\x1B[0m aoi.js is outdated! Update with "npm install aoi.js@latest".');
            }
        } catch (error) {
            console.warn(`\x1b[31mAoiWarning:\x1B[0m Failed to check for updates: ${error.message}`);
        }
    }
}
