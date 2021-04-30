const banAddCommands = require("../handlers/banAddCommands");

module.exports = async (client, guild, user) => {
  if (client.options.fetchInvites) {
    const data = await client.db
      .get("main", `invite-tracker_${guild.id}_${user.id}`)
      .then((d) => d ? d.value : undefined);

    if (data && data.inviter.id) {
      const inviter = await client.db
        .get("main", `invite-tracker_${guild.id}_${data.inviter.id}`)
        .then((d) => d.value);

      inviter.real--;
      inviter.fake++;

      await client.db.set(
        "main",
        `invite-tracker_${guild.id}_${data.inviter.id}`,
        inviter
      );
    }
  }

  banAddCommands(client, guild, user);
};
