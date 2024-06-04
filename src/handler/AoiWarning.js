const { Agent, fetch } = require('undici');
const json = require("../../package.json");
const AoiError = require("../classes/AoiError.js");

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
            AoiError.createConsoleMessage(
                [{ text: 'Outdated version detected, update with "npm install aoi.js@latest"', textColor: 'red' }],
                'white',
                { text: 'AoiWarning', textColor: 'yellow' }
            );
        } else if (isDevVersion) {
            AoiError.createConsoleMessage(
                [{ text: `Unknown version detected, currently on ${json.version} version`, textColor: 'red' }],
                'white',
                { text: 'AoiWarning', textColor: 'yellow' }
            );
        }
    } catch (error) {
        AoiError.createConsoleMessage(
            [{ text: `Failed to check for updates: ${error.message}`, textColor: 'red' }],
            'red',
            { text: 'AoiWarning', textColor: 'yellow' }
        );
    }
};