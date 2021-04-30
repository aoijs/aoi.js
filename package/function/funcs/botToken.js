const botToken = (d) => {
  return {
    code: d.command.code.replaceLast("$botToken", d.client.token),
  };
  // Aoi.js
};

module.exports = botToken;
