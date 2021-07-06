const clientID = (d) => {
  return {
    code: d.command.code.replaceLast("$clientID", d.client.user.id),
  };
};

module.exports = clientID;
