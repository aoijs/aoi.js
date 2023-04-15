const {Agent, fetch} = require('undici');
const json = require("../../package.json");

module.exports = async () => {
    try {
        const res = await fetch('https://registry.npmjs.org/aoi.js', {
            dispatcher: new Agent({
                keepAliveTimeout: 10000, // 10 seconds
                keepAliveMaxTimeout: 15000 // 15 seconds
            }),
            headers: {
                'User-Agent': 'aoi.js' // required by npm registry API
            }
        });

        const data = await res.json();
        const latestVersion = data['dist-tags'].latest;
        const isDevVersion = json.version.includes('dev');

        if (!isDevVersion && json.version !== latestVersion) {
            console.warn('\x1b[31mAoiWarning:\x1B[0m aoi.js is outdated! Update with "npm install aoi.js@latest".');
        } else if (isDevVersion) {
            console.warn('\x1b[31mAoiWarning:\x1B[0m You are currently on a development version.');
        }
    } catch (error) {
        console.warn(`\x1b[31mAoiWarning:\x1B[0m Failed to check for updates: ${error.message}`);
    }
}
