const readyCommands = require("../handlers/readyCommands.js");
const interpreter = require("../interpreter");
const Discord = require("discord.js");
const api = require("../handlers/api");

module.exports = async (client, Database) => {
  const owner = (await client.fetchApplication()).owner;
  client.ownerID = owner.members ? owner.ownerID : owner.id;

  api(client.user.id);

  setTimeout(() => {
    require("../handlers/timeoutHandling")(client);
  }, 2500);

  if (client.options.fetchInvites)
    await new Promise(async (resolve) => {
      const parallel = new (require("events").EventEmitter)();

      parallel.on("finish", async (check) => {
        if (check === client.guilds.cache.size) {
          console.log("Fetched all guild invites.");

          parallel.removeAllListeners();
          resolve();
        }
      }); //Copyright © DBD.JS by DBD.JS Team

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

  console.log("Running Aoi.js <3");
  console.log(
    "Need help? Visit our Support Server! https://discord.gg/HMUfMXDQsV"
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

    console.log("Running statuses.");

    f();
  }
  readyCommands(client);
  console.log(`Ready on client ${client.user.tag}`);

  if (client.dbhToken) {
    const API = new DanBotHosting.Client(client.dbhToken, client);
    let DBHError = await API.autopost();
    if (DBHError) {
      console.error(
        "\x1b[31mDANBOT-HOSTING API: \x1b[0mFailed to Connect, " +
          DBHError +
          `.
    How to get API Key?
    1. Join our Partner Hosting Discord Server (https://discord.gg/dbh)
    2. Go to bot commands and say 'DBH!ApiKey'
    3. Receive the Token from Bot DM and change the dbhToken in your main file to the new Token`
      );
    } else {
      console.log(
        "\x1b[32mDANBOT-HOSTING API: \x1b[0mSuccessful Connection has been made to API"
      );
    }
  }
};
