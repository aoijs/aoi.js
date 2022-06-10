const {
    Interaction,
    ButtonInteraction,
    SelectMenuInteraction,
    ContextMenuInteraction,
    CommandInteraction,
  } = require("discord.js");
  const Interpreter = require("../../interpreter.js");
  const {
    InteractionTypes,
    MessageComponentTypes,
  } = require("../../utils/InteractionConstants.js");
  /**
   * @param  {Interaction | ButtonInteraction | SelectMenuInteraction | ContextMenuInteraction | CommandInteraction } interaction
   * @param  {import('../../classes/Bot.js')} client
   */
  module.exports = async (interaction, client) => {
    client.interactionManager.resolve(interaction);
    if (interaction.isMessageComponent()) {
      client.interactionManager.emit("messageComponentInteraction", interaction);
    }
  
    let cmds;
    const type = InteractionTypes[interaction.type];
    if (type === "component") {
      cmds = client.cmd.interaction[
        MessageComponentTypes[interaction.componentType]
      ]
        .filter((x) =>
          x.name
            ? Array.isArray(x.name)
              ? x.name?.includes(interaction.customId)
              : x.name === interaction.customId
            : !x.name,
        )
        .allValues();
        
        if(!cmds.length) return;
        const data = {
        client: client,
        guild: interaction.guild,
        message: interaction?.message,
        channel: interaction.channel,
        author: interaction.author,
        member: interaction.member,
        isAutocomplete: interaction.isAutocomplete(),
      };
      for (const cmd of cmds) {
        if (cmd.name?.includes("$")) {
          cmd.name = (
            await Interpreter(
              client,
              data,
              [],
              { code: cmd.name, name: "NameParser" },
              client.db,
              true,
              undefined,
              { interaction },
            )
          )?.code;
        }
        await Interpreter(
          client,
          data,
          interaction.values ||
            interaction.options?._hoistedOptions?.map((x) => x.value) || [
              interaction.customId,
            ] ||
            [],
          cmd,
          client.db,
          false,
          undefined,
          { interaction: interaction },
          undefined,
        );
      }
    } else if (type === "modal") {
      cmds = client.cmd.interaction.modal.filterArray(
        (x) => x.name === interaction.customId,
      );
      if (!cmds.length) return;
      const data = {
        client: client,
        guild: interaction.guild,
        message: interaction?.message,
        channel: interaction.channel,
        author: interaction.author,
        member: interaction.member,
      };
      for (const cmd of cmds) {
        if (cmd.name?.includes("$")) {
          cmd.name = (
            await Interpreter(
              client,
              data,
              [],
              { code: cmd.name, name: "NameParser" },
              client.db,
              true,
              undefined,
              { interaction },
            )
          )?.code;
        }
        await Interpreter(
          client,
          data,
          interaction.values ||
            interaction.options?._hoistedOptions?.map((x) => x.value) || [
              interaction.customId,
            ] ||
            [],
          cmd,
          client.db,
          false,
          undefined,
          { interaction: interaction },
          undefined,
        );
      }
    } else {
      cmds = client.cmd.interaction.slash
        .filter(
          (x) => x.name.toLowerCase() === interaction.commandName.toLowerCase(),
        )
        .allValues();
  
      if (!cmds.length) return;
      const data = {
        client: client,
        guild: interaction.guild,
        message: interaction?.message,
        channel: interaction.channel,
        author: interaction.author,
        member: interaction.member,
        isAutocomplete: interaction.isAutocomplete(),
      };
      for (const cmd of cmds) {
        if (cmd.name?.includes("$")) {
          cmd.name = (
            await Interpreter(
              client,
              data,
              [],
              { code: cmd.name, name: "NameParser" },
              client.db,
              true,
              undefined,
              { interaction },
            )
          )?.code;
        }
        await Interpreter(
          client,
          data,
          interaction.values ||
            interaction.options?._hoistedOptions?.map((x) => x.value) || [
              interaction.customId,
            ] ||
            [],
          cmd,
          client.db,
          false,
          undefined,
          { interaction: interaction },
          undefined,
        );
      }
        }
  };
  
  