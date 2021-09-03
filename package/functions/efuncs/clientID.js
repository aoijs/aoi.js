const clientID = (d) => {
  return {
    code: d.command.code.replaceLast("$clientID", d.client.user.id),
  };
  //leref code :3
};

module.exports = clientID;
