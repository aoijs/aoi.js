const axios = require("axios");
async function api(id) {
  try {
    const req = axios
      .post(
        "https://dbdjs.leref.ga/bot",
        {},
        {
          headers: {
            bot: id,
          },
        }
      )
      .catch((err) => null);

    setTimeout(() => {
      api(id);
    }, 65000);
  } catch (e) {
    setTimeout(() => {
      api(id);
    }, 120000);
  }
}

module.exports = api;
