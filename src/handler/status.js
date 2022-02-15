module.exports = (statuses, client) => {
  console.log("\x1b[32mEnabled Client Status\x1b[0m");
  if (statuses.size !== 0) {
    let y = 0;

    let status = statuses.allValues();
    const f = async () => {
      if (!status[y]) {
        y = 0;
      }
      setTimeout(async () => {
        const stats = {};
        stats.activity = {};

        stats.activity.type = status[y].activity.type;
        stats.activity.url = status[y].activity.url;

        stats.activity.name = status[y].activity.name.includes("$")
          ? (
              await client.functionManager.interpreter(
                client,
                {},
                [],
                { code: status[y].activity.name },
                client.db,
                true,
              )
            )?.code
          : status[y].activity.name;

        client.user.setPresence({
          status: status[y].status,
          activities: [stats.activity],
          afk: status[y].afk,
        });

        y++;
        f();
      }, (status[y]?.time || 12) * 1000);
    };
    f();
  }
};
