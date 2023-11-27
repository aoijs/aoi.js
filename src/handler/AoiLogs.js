const json = require("../../package.json");
const AoiError = require("../classes/AoiError.js");

module.exports = async () => {
  try {
    const version = json.version;
    const installedVersion = {
      text: `Installed on v${version}`,
      textColor: "green",
    };
    const discordServer = {
      text: "Discord Server: https://discord.gg/HMUfMXDQsV",
      textColor: "blue",
    };

    AoiError.createCustomBoxedMessage([installedVersion, discordServer], "white", {
      text: "aoi.js ",
      textColor: "cyan",
    });
  } catch (error) {
    console.error(`AoiLogs: Error during initialization: ${error.message}`);
  }
};
