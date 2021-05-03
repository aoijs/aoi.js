module.exports = (client, ratelimit) => {
  require("../handlers/rateLimitCommands")(client, ratelimit);
};
