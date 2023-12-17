module.exports = async (statuses, client) => {
   if (statuses.size <= 0) {
      return;
   }

   const statusArray = statuses.allValues();
   let y = 0;

   const processStatus = async () => {
      if (!statusArray[y]) {
         y = 0;
      }

      const stats = {
         activity: statusArray[y].activity
      };

      if (name = stats?.activity?.name) {
         if (name.includes("$")) {
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
         }
      } else {
         throw new TypeError(`Missing or invalid 'name' method in status[${y}]`);
      }

      client.user.setPresence({
         status: statusArray[y].status,
         activities: [stats.activity],
         afk: statusArray[y].afk,
      });
      setTimeout(processStatus, statusArray[y]?.time * 1000 || 0);
      y++;
   };

   await processStatus();
};