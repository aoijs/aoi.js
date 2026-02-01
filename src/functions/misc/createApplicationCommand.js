const { SlashTypes, ContextTypes, IntegrationTypes } = require("../../utils/InteractionConstants.js");
const { Permissions } = require("../../utils/Constants.js");
const { SlashOptionsParser } = require("../../events/parsers.js");

const INVALID_CONTEXT_TYPES_MESSAGE = "Invalid Context, valid options: " + Object.keys(ContextTypes).join(",");
const INVALID_MEMBER_PERMISSIONS_MESSAGE = "Invalid Member Permissions, valid options: " + Object.keys(Permissions).join(",");

/**
 * @param {import("../..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [
    guildID,
    name,
    description,
    defaultMemberPermissions = "",
    integrationType = "",
    contexts = "all",
    type = "slash",
    options
  ] = data.inside.splits;

    const guild = guildID === "global" ? undefined : await d.util.getGuild(d, guildID);
    if (!guild && guildID !== "global") return d.aoiError.fnError(d, "guild", { inside: data.inside });

  const appContext = contexts === "all" || !contexts.trim().length
    ? [ContextTypes.botdm, ContextTypes.dm, ContextTypes.guild]
    : contexts.split(",").map((x) => ContextTypes[x]);
  if (appContext.includes(undefined)) return d.aoiError.fnError(
    d, "custom", { inside: data.inside },
    INVALID_CONTEXT_TYPES_MESSAGE
  );

  const appIntegrationType = integrationType === "all" || !integrationType.trim().length
    ? [IntegrationTypes.guild, IntegrationTypes.user]
    : integrationType.split(",").map((x) => IntegrationTypes[x]);

  let appPermissions = null;
  if (defaultMemberPermissions?.length) {
    appPermissions = [];
    for (x of defaultMemberPermissions.toLowerCase().split(",")) {
      const permission = Permissions[x];
      if (!permission) return d.aoiError.fnError(
        d, "custom", { inside: data.inside },
        INVALID_MEMBER_PERMISSIONS_MESSAGE
      );
      appPermissions.push(permission);
    }
  }

  let parsedOptions;
  try {
    parsedOptions = options?.length ? JSON.parse(options) : {};
  } catch (err) {
    parsedOptions = await SlashOptionsParser(options);
    return d.aoiError.fnError(d, "custom", {}, "Invalid JSON in options: " + err.message);
  }

  const appData = {
    name: name,
    type: SlashTypes[type] || type,
    ...(type === "slash" ? {
      description: description?.addBrackets(),
      ...(parsedOptions.description_localizations ? { description_localizations: parsedOptions.description_localizations } : {}),
      ...(parsedOptions.name_localizations ? { name_localizations: parsedOptions.name_localizations } : {})
    } : {}),
    defaultMemberPermissions: appPermissions,
    contexts: appContext,
    integrationTypes: appIntegrationType,
    options: parsedOptions.options?.length || []
  };

  await d.client.application.commands.create(appData, guild?.id).catch((e) => {
    d.aoiError.fnError(d, "custom", {}, "Failed To Create Application Command With Reason: " + e);
  });

  return { code: d.util.setCode(data) };
};
