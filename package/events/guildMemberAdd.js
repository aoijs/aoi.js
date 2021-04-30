const joinCommands = require("../handlers/joinCommands.js");
const { Collection } = require("discord.js");

module.exports = async (client, member, db) => {
  if (client.options.fetchInvites) {
    const defaultOpts = {
      inviter: {
        id: "",
        code: "",
      },
      real: 0,
      fake: 0,
    };

    await client.db.set(
      "main",
      `invite-tracker_${member.guild.id}_${member.id}`,
      defaultOpts
    );

    const oldData = client.invites.get(member.guild.id);
    const newData = (
      (await member.guild.fetchInvites().catch((err) => {})) || new Collection()
    ).array();

    for (let i = 0; i < newData.length; ++i) {
      if (
        !isNaN(oldData[newData[i].code])
          ? oldData[newData[i].code] < newData[i].uses
          : false
      ) {
        oldData[newData[i].code] = newData[i].uses;

        const { inviter } = newData[i];

        const Data = {
          ...defaultOpts,
        };

        Data.inviter = {
          id: inviter.id,
          code: newData[i].code,
        };

        await client.db.set(
          "main",
          `invite-tracker_${member.guild.id}_${member.id}`,
          Data
        );

        const type =
          Date.now() - member.user.createdTimestamp > 600000 ? "real" : "fake";

        const data = (await client.db
          .get("main", `invite-tracker_${member.guild.id}_${inviter.id}`)
          .then((d) => (d ? d.value : undefined))) || { ...defaultOpts };

        ++data[type];

        await client.db.set(
          "main",
          `invite-tracker_${member.guild.id}_${inviter.id}`,
          data
        );

        break;
      }
    }
  }

  await joinCommands(client, member, db);
};
