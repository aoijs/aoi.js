module.exports = async (d) => {
  const axios = require("axios");

  const code = d.command.code;

  const boosting = await axios.get(
    `https://dbdjs.leref.ga/booster/${d.client.ownerID}`
  );

  return {
    code: !boosting.data ? code : code.replaceLast(`$booster`, true),
  };
};
