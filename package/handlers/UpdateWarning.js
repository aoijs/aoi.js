const fetch = require("./request");
const json = require("../../package.json");
module.exports = async () => {
  try {
    const get = await new Promise((res) => {
      fetch("https://api.leref.ga/package/version", { method: "GET" })
        .then(res)
        .catch(() => res({}));

      setTimeout(() => res({}), 1000);
    });
    const response = get.json;
    if (response && json.version !== response.version) {
      console.warn(
        "\x1b[33mAoi.js Version: \x1b[0m" +
          response.version +
          " is available for installation ( Installed " +
          json.version +
          " ), update with \"npm install aoi.js@latest\" or enable 'autoUpdate'."
      );
    }
  } catch {}
};
