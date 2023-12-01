const json = require("../../package.json");
const AoiError = require("../classes/AoiError.js");

module.exports = async () => {
  try {
    AoiError.createCustomBoxedMessage(
      [
        {
          text: `Installed on v${json.version}`,
          textColor: "green",
        },
        {
          text: "Discord Server: https://discord.gg/HMUfMXDQsV",
          textColor: "blue",
        },
      ],
      "white",
      {
        text: "aoi.js ",
        textColor: "cyan",
      }
    );
  } catch (err) {
    console.error(`AoiLogs: Error during initialization: ${err}`);
  }
};
