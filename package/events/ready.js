const readyCommands = require("../handlers/readyCommands.js");
const interpreter = require("../interpreter");
const Discord = require("discord.js");
const connectedBots = require("../handlers/connectedBots");

module.exports = async (client, Database) => {
  const owner = (await client.fetchApplication()).owner;
  client.ownerID = owner.members ? owner.ownerID : owner.id;

  if (client.connectedBots) {
  connectedBots(client.user.id);
  console.log("Connected to API.");
  }

  setTimeout(() => {
    require("../handlers/timeoutHandling")(client);
  }, 2500);

  if (client.options.fetchInvites)
    await new Promise(async (resolve) => {
      const parallel = new (require("events").EventEmitter)();

      parallel.on("finish", async (check) => {
        if (check === client.guilds.cache.size) {
          console.log("Fetched all Guild invites.");

          parallel.removeAllListeners();
          resolve();
        }
      }); //Copyright © aoi.js

      const guilds = client.guilds.cache.array();

      let i = 0;
      let parallels = 1;

      client.invites = new Discord.Collection();

      while (i < guilds.length) {
        const c = i;

        (async () => {
          const data = {};

          const invites = (
            (await guilds[c].fetchInvites().catch((err) => {})) ||
            new Discord.Collection()
          ).array();

          let inv = 0;

          while (inv < invites.length) {
            data[invites[inv].code] = invites[inv].uses || 0;

            inv++;
          }

          client.invites.set(guilds[c].id, data);

          parallel.emit("finish", parallels++);
        })();

        i++;
      }
    });

  console.log('Initialized on \x1b[36maoi.js \x1b[0m|| \x1b[32mv' + require("../../package.json").version + '\x1b[0m');
  console.log(
    "Our Official Discord Server: https://aoi.js.org/invite"
  );

  if (client.statuses.size) {
    let y = 0;

    const f = async () => {
      if (client.statuses.array()[y] === undefined) y === 0;

      const status = client.statuses.array()[y];

      const t = await interpreter(
        client,
        {},
        [],
        {
          name: "status",
          code: status.text,
        },
        undefined,
        true
      );

      setTimeout(() => {
        client.user.setPresence({
          activity: {
            type: status.type,
            name: t,
            url: status.url,
          },
          status: status.status,
        });

        if (client.statuses.array()[y] === undefined) y = 0;

        f();
      }, status.time * 1000);

      y++;
    };

    console.log("Enabling all Statuses.");

    f();
  }
  readyCommands(client);
};
