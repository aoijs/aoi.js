const leaveCommands = require("../handlers/leaveCommands.js");

module.exports = async (client, member, db) => {
  if (client.options.fetchInvites) {
    const data = await client.db
      .get("main", `invite-tracker_${member.guild.id}_${member.user.id}`)
      .then((d) => (d ? d.value : undefined));

    if (data && data.inviter.id) {
      const inviter = await client.db
        .get("main", `invite-tracker_${member.guild.id}_${data.inviter.id}`)
        .then((d) => d.value);

      inviter.real--;
      inviter.fake++;

      await client.db.set(
        "main",
        `invite-tracker_${member.guild.id}_${data.inviter.id}`,
        inviter
      );
    }
  }

  leaveCommands(client, member, db);
};
