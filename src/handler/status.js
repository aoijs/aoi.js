module.exports = async (statuses, client) => {
  if (statuses.size === 0) {
    return;
  }

  const statusArray = statuses.allValues();
  let y = 0;

  const processStatus = async () => {
    if (!statusArray[y]) {
      y = 0;
    }

    const stats = {
      activity: {
        type: statusArray[y].activity.type,
        url: statusArray[y].activity.url,
      },
    };

    if (statusArray[y].activity.name) {
      if (statusArray[y].activity.name.includes("$")) {
        stats.activity.name = (
            await client.functionManager.interpreter(
                client,
                {},
                [],
                { code: statusArray[y].activity.name },
                client.db,
                true
            )
        )?.code;
      } else {
        stats.activity.name = statusArray[y].activity.name;
      }
    } else {
      throw new TypeError(`Use the name method or provide a name for status[${y}]`);
    }

    client.user.setPresence({
      status: statusArray[y].status,
      activities: [stats.activity],
      afk: statusArray[y].afk,
    });

    y++;

    if (y < statusArray.length) {
      setTimeout(processStatus, statusArray[y]?.time * 1000 || 0);
    }
  };

  await processStatus();
};
