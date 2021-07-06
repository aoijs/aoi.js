const clientToken = (d) => {
  return {
    code: d.command.code.replaceLast("$clientToken", d.client.token),
  };
};

module.exports = clientToken;
