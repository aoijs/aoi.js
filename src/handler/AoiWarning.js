const { Agent, fetch } = require("undici");
const json = require("../../package.json");
const AoiError = require("../classes/AoiError.js");

const compareVersions = (a, b) => a.split(".").map(Number).some((v, i) => v > (b.split(".")[i] || 0));

module.exports = async () => {
  try {
    const res = await fetch("https://registry.npmjs.org/aoi.js", {
      dispatcher: new Agent({
        keepAliveTimeout: 10000, // 10 seconds
        keepAliveMaxTimeout: 15000, // 15 seconds
      }),
      headers: {
        "User-Agent": "aoi.js", // required by npm registry API
      },
    });

    const data = await res.json();
    const latestVersion = data["dist-tags"].latest;

    if (compareVersions(json.version, latestVersion) === false && json.version !== latestVersion) {
      AoiError.createCustomBoxedMessage(
        [
          {
            text: 'aoi.js is outdated! Update with "npm install aoi.js@latest".',
            textColor: "red",
          },
        ],
        "white",
        { text: "AoiWarning", textColor: "yellow" }
      );
    } else if (json.version.includes("dev") || compareVersions( json.version, latestVersion) === true) {
      AoiError.createCustomBoxedMessage(
        [
          {
            text: "You are currently on a development version.",
            textColor: "red",
          },
          {
            text: "This version may or may not contain unfinished features.",
            textColor: "red",
          },
        ],
        "white",
        { text: "AoiWarning  ", textColor: "yellow" }
      );
    }
  } catch (error) {
    AoiError.createCustomBoxedMessage(
      [
        {
          text: `AoiWarning: Failed to check for updates: ${error.message}`,
          textColor: "white",
        },
      ],
      "red",
      { text: "AoiWarning", textColor: "yellow" }
    );
  }
};
