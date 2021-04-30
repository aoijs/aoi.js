const ms = require("ms");
module.exports = (client) => {
  client.db
    .all("main", {
      filter: (x) => x.key.startsWith("timeout_"),
    })
    .then((datas) => {
      datas.map((data) => {
        require("./singleTimeout")(client, data.data.value);
      });
    });
};
