module.exports = async (statuses, client) => {
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

        if (status[y].activity.name) {

          if (status[y].activity.name.includes("$")) {
            stats.activity.name = (
                await client.functionManager.interpreter(
                    client,
                    {},
                    [],
                    { code: status[y].activity.name },
                    client.db,
                    true,
                )
            )?.code;
          } else {
            stats.activity.name = status[y].activity.name;
          }
        } else {
          throw new TypeError(`Use the name method or provide a name for status[${y}]`);
        }

        client.user.setPresence({
          status: status[y].status,
          activities: [stats.activity],
          afk: status[y].afk,
        });

        y++;
        await f();
      }, (status[y]?.time || 12) * 1000);
    };
    f();
  }
};
