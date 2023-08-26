const json = require("../../package.json");
const createCustomBoxedMessage = require('../utils/CustomBox.js'); // Adjust the path accordingly

module.exports = async () => {
    try {
        const version = json.version;
        const installedVersion = { text: `Installed on v${version}`, textColor: 'green' };
        const discordServer = { text: 'Discord Server: https://discord.gg/HMUfMXDQsV', textColor: 'blue' };

        createCustomBoxedMessage(
            [installedVersion, discordServer],
            'white',
            { text: 'aoi.js ', textColor: 'cyan' } // Specify title and title color
        ); // Specify text, border color, and title
    } catch (error) {
        console.error(`AoiLogs: Error during initialization: ${error.message}`);
    }
};
