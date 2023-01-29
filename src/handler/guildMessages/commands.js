const Interpreter = require("../../interpreter.js");
const Util = require("../../classes/Util.js");
module.exports = async (message, client) => {
    if (client.messageEventOptions) {
        const options = client.messageEventOptions;

        if (
            (!options.respondToBots &&
                (message.webhookId || message.author.bot)) ||
            (options.guildOnly && message.channel.type === Util.channelTypes.DM)
        )
            return;
    }
    //array of cmds
    let cmds = client.cmd.default
        .allValues()
        .filter((x) => !x.nonPrefixed && x.name !== "$alwaysExecute");
    //console.log({cmds })
    //getting arrays of prefixes
    const prefixes = Array.isArray(client.prefix)
        ? client.prefix.map(async (x) =>
              x.includes("$")
                  ? (
                        await Interpreter(
                            client,
                            message,
                            message.content.split(" "),
                            { name: "PrefixParser", code: x },
                            client.db,
                            true,
                        )
                    )?.code?.addBrackets()
                  : x,
          )
        : client.prefix.includes("$")
        ? [
              (
                  await Interpreter(
                      client,
                      message,
                      message.content.split(" "),
                      { code: client.prefix },
                      client.db,
                      true,
                  )
              )?.code?.addBrackets(),
          ]
            : [ client.prefix ];
    //for loop of prefix array
    for (let prefix of prefixes) {
        prefix = await prefix;
        if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()))
            continue;
        //getting message
        const msg = message.content.slice(prefix.length).trim();
        //finding command
        const cmd = cmds
            .filter(
                ( x ) =>
                {
                    // console.log( x );
                    return ( msg.toLowerCase().startsWith( x.name.toLowerCase() ) &&
                        msg
                            .split( " " )
                            .slice( 0, x.name.split( " " ).length )
                            .join( " " )
                            .toLowerCase() === x.name.toLowerCase() ) ||
                        ( Array.isArray( x.aliases )
                            ? x.aliases.find(
                                ( y ) =>
                                    msg
                                        .toLowerCase()
                                        .startsWith( y.toLowerCase() ) &&
                                    msg
                                        .split( " " )
                                        .slice( 0, y.split( " " ).length )
                                        .join( " " )
                                        .toLowerCase() === y.toLowerCase(),
                            )
                            : msg
                                ?.toLowerCase()
                                .startsWith( x.aliases?.toLowerCase() ) &&
                            msg
                                .split( " " )
                                .slice( 0, x.aliases?.split( " " ).length )
                                .join( " " )
                                ?.toLowerCase() === x.aliases?.toLowerCase() );
                        } )
            ?.sort((a, b) => a.name.length - b.name.length)
            .reverse()[0];
        if (!cmd) break;
        const cmdName =
            msg.toLowerCase().startsWith(cmd.name.toLowerCase()) &&
            msg
                .toLowerCase()
                .split(" ")
                .slice(0, cmd.name.split(" ").length)
                .join(" ") === cmd.name.toLowerCase()
                ? cmd.name
                : (Array.isArray(cmd.aliases)
                      ? cmd.aliases.find(
                            (x) =>
                                msg.toLowerCase().startsWith(x.toLowerCase()) &&
                                msg
                                    .toLowerCase()
                                    .split(" ")
                                    .slice(0, x.split(" ").length)
                                    .join(" ") === x.toLowerCase(),
                        )
                      : msg
                            .toLowerCase()
                            .split(" ")
                            .slice(0, cmd.aliases.split(" ").length)
                            .join(" ") === cmd.aliases.toLowerCase()) ||
                  cmd.aliases;
        //args
        const args = msg
            .slice(cmdName?.length || "")
            .split(" ")
            .slice(1);

        //if command doesn't exist , then break the loop
        if (!cmd.executeAt) cmd.executeAt = "guild";
        if (
            cmd.executeAt === "guild" &&
            message.channel.type === Util.channelTypes.DM
        )
            break;
        else if (
            cmd.executeAt === "dm" &&
            message.channel.type !== Util.channelTypes.DM
        )
            break;
        //if cmd.async is true
        if (cmd.async) {
            await Interpreter(client, message, args, cmd, client.db);
        }
        //non async execution
        else {
            Interpreter(client, message, args, cmd, client.db);
        }
        break;
    }
};
