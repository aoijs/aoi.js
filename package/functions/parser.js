const Parser = {
  $setServerVar:
    "Sets a server variable value;$setServerVar[variable;value;guildID (optional)]",
  $serverCount: "Displays the amount of servers your bot's in.",
  $ram: "returns the memory usage in MB.",
  $activity: "Return's the user activities.;$activity or $activity[userID]",
  $findChannel:
    "Finds a channel in this server. If last field is set to no, and the function couldn't find any channel, it'll return undefined.;$findChannel[ID/mention/name;returnCurrentChannel (yes/no) (optional)]",
  $ping: "Returns the Client Websocket ping ms",
  $findUser:
    "Returns an user's ID, or the author's ID if last field is set to 'yes' (defaults to yes), or else it'll return undefined;$findUser[ID/name/name#discriminator/mention;returnCurrentUser (yes/no) (optional)]",
  $globalCooldown:
    "Sets a Global Cooldown to this user;$globalCooldown[time;error message]",
  $getUserBadges:
    "Returns the user's badges\nNitro Classic and Nitro Boosting badges are not 100% guaranteed to be retrieved.;$getUserBadges or $getUserBadges[userID]",
  $ban:
    "Bans an user from the server by using their ID.;$ban[userID;reason;messages to delete (days)]",
  $disableMentions: "Replaces all the user mentions with their user names",
  $authorID: "Returns the author's ID.",
  $serverBoostCount: "Returns the amount of boosts this server has",
  $cooldown: "Sets a server user cooldown;$cooldown[time;error message]",
  $eval: "Evals a code given.;$eval[code (aoi.js);returnCode (optional) (yes/no)]",
  $truncate: "Truncates the number to 0 decimals.;$truncate[number]",
  $memberExists:
    "Checks if given user ID is in the server;$memberExists[userID;guildID (optional)]",
  $parseDate: "Parses given ms to date or time;$parseDate[ms;date/time]",
  $customEmoji: "Returns a custom emoji;$customEmoji[name;guildID(optional)]",
  $createChannel:
    "Creates a channel with given type and name. If 3rd field is set to 'yes', the function will return the newly created channel ID. If categoryID field is present, the channel will be created under the category with given ID;$createChannel[name;type;return ID (yes/no);categoryID (optional)]",
  $deleteChannels:
    "Delete a channel or channels by using their IDs.;$deleteChannels[channelID;channelID;...]",
  $dateStamp: "Returns the current date since 1970 in ms.",
  $thumbnail: "Sets a thumbnail to the embed;$thumbnail[url]",
  $systemChannelID:
    "Returns the system channel ID of this server (if any);$systemChannelID or $systemChannelID[guildID]",
  $serverVerificationLevel:
    "Returns the server verification level of this guild",
  //$mention: "Returns the mention of the author",
  $round: "Rounds the number to the unit;$round[number]",
  $platform:
    "Returns the devices the user is using for Discord;$platform or $platform[userID]",
  $reactionCollector:
    "Creates a reaction collector for given message ID;$reactionCollector[messageID;userFilter;time;reaction1,reaction2,...;command1,command2,...;removeReactions (yes/no)]",
  $roleName: "Returns a Role name using their ID;$roleName[roleID]",
  $roleCount: "Returns the amount of roles in this guild",
  $channelCount:
    "Returns the amount of channels in this guild;$channelCount or $channelCount[type]",
  $awaitReaction:
    "Awaits an user reaction in this message;$awaitReaction[userFilter;time;bot message;reaction1,reaction2,...;command1,command2,...;error message;deleteMessageUponReact (yes/no) (optional)]",
  $channelSendMessage:
    "Sends a message to given channel ID\nIf last field is set to yes, it'll return the newly sent message ID;$channelSendMessage[channelID;message;return message ID (yes/no) (optional)]",
  $kick:
    "Kicks an user from the server by using their ID;$kick[userID;reason (optional)]",
  $serverCooldown: "Sets a Server cooldown;$serverCooldown[time;error message]",
  $hasPerms:
    "Check if given user ID has the provided perms;$hasPerms[userID;perm1;perm2;...]", //?
  $mentionedRoles:
    "Returns the roles that were mentioned by the user;$mentionedRoles[mention number]",
  $joinSplitText:
    "Joins the $textSplit indexes by <separator>;$joinSplitText[separator]||$joinSplitText[ | ] //will return 'hello | bye | lol'\n\n$textSplit[hello-bye-lol;-]",
  $globalUserLeaderboard:
    "Creates a global user leaderboard;$globalUserLeaderboard[variable;asc/desc (optional);{top}.- {username} - {value};list (optional);page (optional)]",
  $getGlobalUserVar:
    "Gets a global user variable value;$getGlobalUserVar[variable;userID (optional)]",
  $setGlobalUserVar:
    "Sets a global user variable value;$setGlobalUserVar[variable;value;userID (optional)]",
  $isNumber: "Checks if given input is a number or not;$isNumber[value]",
  $textSplit: "Splits a text by <separator>;$textSplit[some_text;separator]",
  $serverIcon:
    "Returns the Server Icon;$serverIcon or $serverIcon[guildID;size (optional);dynamic (yes/no)(optional)]",
  $giveRoles:
    "Gives a role or roles to given user ID;$giveRoles[userID;roleID;roleID;...]",
  $findMember:
    "Finds a member in this guild, returns the user ID, or author ID if last field is set to 'yes' (defaults to yes), or else it'll return undefined.;$findMember[nickname/ID/mention/username/username#dicriminator;returnCurrentUser (yes/no) (optional)]",
  $addEmoji:
    "Adds an emoji to this guild. If role IDs are given, the emoji will only be usable by users with one of provided role IDs;$addEmoji[url;name;returnEmoji (yes/no)(optional);roleID1;roleID2;...]",
  $splitText: "Gets a value from $textSplit;$splitText[index]",
  $botCount: "Returns the amount of bots in this server",
  $textSplitMap:
    "Creates a loop over all the indexes of $textSplit, $message[1] will contain said value;$textSplitMap[awaited command 1;awaited command 2;...]",
  $onlyForIDs:
    "Only given user IDs will be able to execute this command;$onlyForIDs[userID;userID;...;error message]",
  $noEscapingMessage:
    "Special characters won't be replaced;$noEscapingMessage or $noEscapingMessage[arg number]",
  $message:
    "Returns the user's \nIf this function is called on a slash command, it will contain the value of either given option index or all the option values;$message or $message[arg number]",
  $channelNSFW:
    "Returns whether the channel is nsfw or not;$channelNSFW or $channelNSFW[channelID]",
  $takeRoles:
    "Takes a role or roles from given user ID;$takeRoles[userID;roleID;roleID;...]",
  $membersCount:
    "Returns the amount of users in this server;$membersCount or $membersCount[guildID;presence (optional);countBots (optional)(yes/no)]",
  $channelName:
    "Returns the Channel Name;$channelName or $channelName[channelID]",
  $userID: "Returns an user ID with given user name;$userID[username]",
  $addTimestamp:
    "Sets a timestamp to the embed;$addTimestamp or $addTimestamp[ms]",
  $username: "Returns the user's username;$username of $username[userID]",
  "$clear[":
    "Clears an amount of messages from given channel ID;$clear[amount;filter (optional);channelID (optional)]",
  $sendMessage:
    "Sends a message to this channel;$sendMessage[message;return message ID (yes/no)(optional)]",
  $description: "Sets an embed description;$description[text]",
  $userAvatar:
    "Returns the user's avatar;$userAvatar or $userAvatar[userID;size (optional);dynamic (optional)]",
  $image: "Sets an image to the embed;$image[url]",
  $guildRoles:
    "Returns all the roles of this guild;$guildRoles or $guildRoles[id/name/mention]",
  $title: "Sets an embed title;$title[text;url (optional)]",
  $sum: "Sum up the given args;$sum[1;3;...]",
  "$loop[":
    "loops an awaited command name for  times;$loop[times;awaited command 1;awaited command 2;...]",
  $editMessage:
    "Edits a message with given message ID;$editMessage[messageID;new message;channelID (optional)]",
  $banCount: "Returns the amount of users banned",
  $wait: "Stops the code execution for given time;$wait[time]",
  $roleID: "returns the role ID of given role name;$roleID[role name]",
  $commandName: "Returns the command name",
  $commandCode: "Returns the command code",
  $sub: "Subtracts a number;$sub[1;2;...]",
  $numberSeparator:
    "Separates a number in thousands;$numberSeparator[number;separator (optional)]",
  $hasRoles:
    "Checks if given user ID has the provided roles;$hasRoles[userID;roleID;roleID;...]",
  $channelType:
    "Returns the channel type;$channelType or $channelType[channelID]",
  $allMembersCount: "Returns the total user count of the bot",
  $serverContentFilter: "Returns the content filter level of this guild",
  $roleExists: "Checks if given role ID exists;$roleExists[roleID]",
  $channelExists: "Checks if given channel ID exists;$channelExists[channelID]",
  "$random[":
    "Returns a random number from X to Y;$random[min;max;allowDecimals (yes/no);random (yes/no)]",
  $userExists: "Checks if the given user ID exists;$userExists[userID]",
  $multi: "Multiplicates X by Y;$multi[1;4;...]",
  $unban:
    "Unbans a user from the server by using their ID or username;$unban[userID/username;reason (optional)]",
  $randomText:
    "Returns a random text from given texts;$randomText[some;random;text;...]",
  $userLeaderboard:
    "Creates an user leaderboard;$userLeaderboard[variable;asc/desc (optional);{top}.- {username} - {value};list (optional);page (optional)]",
  $noMentionMessage:
    "User's message without mentions;$noMentionMessage or $noMentionMessage[arg number]",
  $replaceText: "Replaces A to X in TEXT;$replaceText[some text;sample;new]",
  $unsuppressEmbeds: "Unsuppresses embeds on a message.;$unsuppressEmbeds[channelID;messageID]",
  $suppressEmbeds: "Suppresses embeds on a message.;$suppressEmbeds[channelID;messageID]",
  $removeNumbers: "Removes numbers from the provided text.;$removeNumbers[text]",
  $removeNewLines: "Removes new lines from the provided text.;$removeNewLines[text]",
  $removeSpecialChars: "Removes special characters from the provided text.;$removeSpecialChars[text]",
  $isChannelManageable: "Returns whether the bot can manage the provided channel.;$isChannelManageable[channelID]",
  $isVideoOn: "Whether or not this user's video is on.;$isVideoOn[userID]",
  $isSelfMuted: "Whether or not this user is self-muted.;$isSelfMuted[userID]",
  $isSelfDeafened: "Whether or not this user is self-deafened.;$isSelfDeafened[userID]",
  $isServerMuted: "Whether or not this user is server-muted.;$isServerMuted[userID]",
  $isServerDeafened: "Whether or not this user is server-deafened.;$isServerDeafened[userID]",
  $readyTimestamp: "Returns the timestamp that the client was last ready. Timestamp is expressed in milliseconds.",
  $isRoleEditable: "Whether this role is editable by the bot.;$isRoleEditable[roleID]",
  $setRolePosition: "Changes the role's position.;$setRolePosition[roleID;newPosition]",
  $divide: "Divides a number by X;$divide[5;2]",
  $getUserVar:
    "Gets an user variable value;$getUserVar[variable;userID (optional);guildID (optional)]",
  "$color[": "Sets a embed color;$color[hex or number]",
  $guildID:
    "Returns the ID of this guild or given guild name.;$guildID[guild name]",
  $rulesChannelID: "Returns the server's rules channel ID.;$rulesChannelID[(optional) guildID]",
  $addField:
    "Adds a field to the embed;$addField[name;value;inline (yes/no)(optional)]",
  $changeNickname:
    "Changes the nickname of given user ID;$changeNickname[userID;nickname]",
  $setUserVar:
    "Sets a user variable value;$setUserVar[variable;value;userID (optional);guildID (optional)]",
  $addCmdReactions:
    "Adds reactions to the user's message;$addCmdReactions[😀;😎]",
  $discriminator:
    "Returns the user's discriminator;$discriminator or $discriminator[userID]",
  $awaitMessages:
    "Awaits a message from given user ID or everyone in this channel.\nLast field will determine whether the bot should or not await a message in a user's DM.;$awaitMessages[userID/everyone;time;reply1,reply2,.../everything;command1,command2,...;error message;userID (optional)]",
  $getServerVar:
    "Gets a server variable value;$getServerVar[variable;guildID (optional)]",
  "$mentioned[":
    "Returns the ID of the mentioned user;$mentioned[mention number;return author ID (yes/no)(optional)]",
  $addReactions: "adds reactions to the bot's response;$addReactions[😀;😎]",
  $nickname:
    "returns the nickname of the user in this guild (if any);$nickname or $nickname[userID]",
  $footer: "sets an embed footer;$footer[text;url]",
  $editIn:
    "edits the bot's message after given time;$editIn[time;new message;next message;...]",
  $dm: "dms the author;$dm or $dm[userID]",
  $useChannel:
    "command will be sent to given channel ID;$useChannel[channelID]",
  $isBoosting:
    "checks if the user is boosting this server;$isBoosting or $isBoosting[userID]",
  $mentionedChannels:
    "returns the mentioned channel ID;$mentionedChannels[mention number;return current channel ID (yes/no)(optional)]",
  $author:
    "sets an embed author, third determines whether the author should contain a hyperlink.;$author[text;url;link]",
  $toLocaleUppercase:
    "capitalizes the first letter of all the given words;$toLocaleUpperCase[some words here]",
  "$onlyIf[":
    "checks if a condition is true;$onlyIf[value(!=/==/>=/<=/>/<)value2;error message]",
  $toUppercase: "makes all the letters uppercase;$toUpperCase[text]",
  $toLowercase: "makes all the letters lowercase;$toLowerCase[text]",
  $channelID:
    "returns the channel ID of this channel;$channelID or $channelID[channel name]",
  $commandsCount: "returns the amount of commands of this bot",
  $userTag:
    "returns the user name and discriminator;$userTag or $userTag[userID]",
  $jsonRequest:
    "makes a json request (GET method) and returns a property from it;$jsonRequest[url;property;error message;headerName:headerValue;headerName:headerValue;...]",
  $ownerID: "returns the server owner id;$ownerID or $ownerID[guildID]",
  $serverFeatures:
    "returns the guild's features;$serverFeatures or $serverFeatures[guildID]",
  $highestRole:
    "returns the user's highest role in this guild;$highestRole or $highestRole[userID]",
  $randomString: "generates a random string;$randomString[length]",
  $getServerInvite:
    "creats an invite link to this server;$getServerInvite or $getServerInvite[guildID]",
  $getChannelVar:
    "gets a channel variable value;$getChannelVar[variable;channelID (optional)]",
  $setChannelVar:
    "sets a channel variable value;$setChannelVar[variable;value;channelID (optional)]",
  $checkContains:
    "checks if given text provides any of the texts;$checkContains[message;word1;word2;...]",
  $deleteRoles: "deletes a role or roles;$deleteRoles[roleID;roleID;...]",
  $shardID: "Returns The Shard ID.",
  //$reactionRoleRemove: "removes a reaction role",
  $voiceID:
    "returns the voice channel's ID this user is connected to. (if any);$voiceID or $voiceID[userID]",
  $partial: "checks if the object structure is partial or not",
  $rolePosition: "returns the role position of this role;$rolePosition[roleID]",
  $deletecommand: "deletes the user's message",
  $attachment:
    "adds an attachment.\nIf name field is given, you must specify the extension for the attachment (png, webp, or gif);$attachment[data;name (optional);type (url or buffer) (optional)]",
  $queueLength: "Returns the amount of songs in the queue (or 0)",
  $isValidInvite:
    "checks if an invite url is valid;$isValidInvite[invite code]",
  $setVar: "sets a global var;$setVar[variable;value]",
  $isBot: "Returns if the user is a bot or not.;$isBot or $isBot[userID]",
  $getVar: "gets a global var;$getVar[variable]",
  $emojiName: "Returns the emoji name the user reacted with",
  $getTextSplitLength: "gets the length of the $textSplit",
  $createRole:
    "creates a role in this guild;$createRole[name;color (optional);mentionable (optional);hoisted (optional);position (optional);permission;permission;...]",
  $serverName:
    "Returns the Current Guild or ID of Guild;$serverName or $serverName[guildID]",
  //$reactionRoleAdd: "adds a reaction role",
  $onlyPerms:
    "checks if the author has the provided permissions.;$onlyPerms[perm1;perm2;...;error message]",
  $checkCondition:
    "Checks if given condition is true or false.;$checkCondition[value(!=/==/>=/<=/>/<)value2]",
  $removeLinks: "Removes all links from the provided text.;$removeLinks[text]",
  $serverIDs:
    "returns the ID of all the servers this bot is in;$serverIDs or $serverIDs[separator]",
  $clientID: "Returns the Bot ID",
  $shardCount: "Returns how many shards the Client has;$shardCount",
  $blackListRoleIDs:
    "Blacklist roles from using this command by using their IDs.;$blackListRoleIDs[roleID;roleID;...;error message]",
  $blackListIDs:
    "Blacklist users from using this command by using their IDs.;$blackListIDs[userID;userID;...;error message]",
  $emojiID: "Returns the emoji ID of the emoji the user reacted with",
  $editTextSplitElement:
    "Edits the value from given index.;$editTextSplitElement[index;new value]",
  $lerefAvatar: "Returns Leref Profile Picture;$lerefAvatar",
  $blackListServerIDs:
    "Blacklist servers from using this command;$blackListServerIDs[guildID;guildID;...;error message]",
  $authorMessage:
    "Returns the ID of the user this message belongs to. (for callbacks like reaction add / remove, or message delete/ update)",
  $removeTextSplitElement:
    "Removes an element from $textSplit by using its index.;$removeTextSplitElement[index]",
  $findTextSplitIndex:
    "Finds the index of a splitted value in $textSplit;$findTextSplitIndex[value]",
  //$userMessageID: "Returns the user's message ID",
  $emojiToString: "Returns the emoji the user reacted with",
  $queue:
    "Returns a queue of songs;$queue or $queue[page;amount;{number}) {title} by <@{userID}>;return current (yes or no) (optional)]",
  $authorAvatar: "Returns the author's avatar.",
  $creationDate:
    "Returns the creation date of given channel, guild, emoji, user or role ID.;$creationDate[emojiID/userID/roleID/channelID/guildID/messageID;date/time/ms (optional)]",
  $userRoles:
    "Returns the user roles.;$userRoles or $userRoles[userID;ids/mentions/names (optional);separator (optional)]",
  $status:
    "Returns the user's presence status. (Presence intent needs to be enabled on Discord Dev Portal);$status or $status[userID]",
  $charCount:
    "Counts character of a text, or the user's message.;$charCount or $charCount[text]",
  $getMessageVar:
    "Gets a message variable value;$getMessageVar[variable;messageID (optional)]",
  $memberJoinedDate:
    "Returns the date the user joined this server;$memberJoinedDate or $memberJoinedDate[userID;date/time/ms (optional)]",
  $argsCheck:
    "Checks for user arguments.;$argsCheck[(>/</none)number;error message]",
  $setMessageVar:
    "Sets a message variable value;$setMessageVar[variable;value;messageID (optional)]",
  $suppressErrors:
    "Suppress any given errors and sends a custom one. {error} will contain the error that was thrown.;$suppressErrors or $suppressErrors[message]",
  $serverChannelExists: "$serverChannelExists;$serverChannelExists[channelID]",
  $filterMessage:
    "Removes letters or numbers from given text;$filterMessage[message;letterOrSymbols]",
  $onlyNSFW:
    "Makes this command only executable in NSFW channels.;$onlyNSFW[error message]",
  $playSong:
    "Plays a song from Youtube. Support Playlist & URL;$playSong[song;leave vc time;defean (yes or no);leave when vc empty (yes/no);error]",
  $getRoleColor: "Gets the color of given role ID;$getRoleColor[roleID]",
  $getBotInvite: "Returns the Client Invite Link;$getBotInvite",
  $onlyForServers:
    "the command will only be executable in these guild IDs.;$onlyForServers[guildID;guildID;...]",
  $log: "Logs something in the console / terminal.;$log[text]",
  $getEmbed:
    "Gets information on an embed.;$getEmbed[channelID;messageID;property]",
  $djsEval: "Evals a js + djs code.;$djsEval[code;output (yes/no) (optional)]",
  $messageAttachment:
    "Returns the first attachment url of this message. (if any);$messageAttachment",
  $volume:
    "Returns Current Volume Number & Sets a volume for the all songs in queue.;$volume or $volume[number]",
  $onlyBotPerms:
    "Checks for bot permissions in this guild;$onlyBotPerms[perm1;perm2;...;error message]",
  $sendDM: "Sends a DM message to given user ID.;$sendDM[userID;message]",
  $cloneChannel:
    "Clones a channel.;$cloneChannel or $cloneChannel[channelID]",
  $setGuildName: "Sets a new Name for this guild.;$setGuildName[name]",
  $setGuildIcon: "Sets a new Icon for this guild.;$setGuildIcon[url]",
  $deleteIn: "Deletes the bot's response after given time;$deleteIn[time]",
  $userPerms:
    "Returns the user's key permissions.;$userPerms or $userPerms[userID;separator (optional)]",
  $rolePerms:
    "Returns the role key permissions.;$rolePerms[roleID;separator (optional)]",
  $songInfo:
    "Displays information about the song that is being played.;$songInfo[property;position]",
  $onlyForRoles:
    "The command will be only executed if the user has any of these role IDs / Names.;$onlyForRoles[roleID/Name;roleID/Name;...;error message]",
  $botTyping: "Shows that the bot is currently typing;$botTyping[duration]",
  $uptime: "Returns the Uptime of the Client;$uptime",
  $hasRole:
    "Checks if the user has the given role.;$hasRole[userID;roleID;guildID (optional)]",
  $channelUsed: "Returns the channel ID where this callback came from;$channelUsed",
  $botLeave:
    "The bot is forced to leave the guild;$botLeave or $botLeave[guildID]",
  //UPDATE 0.6.0//
  $findServerChannel:
    "Returns a channel ID in this server, or the channel ID this command was ran in only if last field is set to 'yes' (defaults to yes), or else it'll return undefined..;$findServerChannel[name/mention/id;returnCurrentChannel (yes/no) (optional)]",
  $messageSlice: `Slices this message from X to Y (or just X).;$messageSlice[from;to (optional)]`,
  $usersWithRole:
    "Returns a list of users with given role (members are given from the cache.);$usersWithRole[roleID;separator (optional);forceCaching (yes/no)(optional)]",
  $getCustomStatus:
    "Gets the user's custom status state or emoji. (if any);$getCustomStatus or $getCustomStatus[userID;state/emoji (optional)]",
  $resetUserVar:
    "Resets user variables values for this guild.;$resetUserVar[variable]",
  $resetGlobalUserVar:
    "Resets global user variable values.;$resetGlobaUserVar[variable]",
  $resetVar: "Resets global variable values.;$resetVar[variable]",
  $repeatMessage:
    "Repeats a message for X times.;$repeatMessage[times;message]",
  $randomUserID: "Returns a random user ID from this server.",
  $addObjectProperty:
    "Adds a key with a value to the existing object.;$addObjectProperty[key;value]",
  $createObject:
    "Creates an object that can be used later.;$createObject[object string]",
  $getObjectProperty:
    "Gets a property value from given key.;$getObjectProperty[key]",
  $randomChannelID: "Returns a random text channel ID.",
  $randomMention: "Mentions a random user of this server.",
  $roundTenth: "Rounds a number to given unit.;$roundTenth[number;round]",
  "$getMessage[":
    "Gets information of given message ID.;$getMessage[channelID;messageID;userID/content/description]",
  $colorRole:
    "Changes the color of given role ID.;$colorRole[roleID;hex or int color]",
  $isValidObject:
    "Checks if given string is a valid object.;$isValidObject[string {}]",
  $resetServerVar: "Resets server variables values.;$resetServerVar[variable]",
  $onlyIfMessageContains:
    "Checks if 'text' contains all the provided words.;$onlyIfMessageContains[text;word1;word2;...;error message]",
  $skipSong: "Skip the current song to next queue song;$skipSong",
  $pauseSong: "Pause the current song;$pauseSong",
  $resumeSong: "Resume the song from being paused;$resumeSong",
  $stopSong: "Stop the bot from playing songs;$stopSong",
  //UPDATE 0.6.5 - DBD.JS :3
  $removeSplitTextElement:
    "Removes an element or elements from $textSplit by using their indexes.;$removeSplitTextElement[index;index2;...]",
  $usersInChannel:
    "Returns the users that are connected to this voice channel.;$usersInChannel[channelID;id/mention/username (optional);separator (optional)]",
  $slowmode:
    "Sets a channel slowmode (or removes it by using 0).;$slowmode[channelID;time]",
  $randomGuildID: `Returns a random guild ID the bot's in.`,
  $setBotAvatar: "Sets the bot's avatar.;$setBotAvatar[url]",
  $usersBanned:
    "Returns a list of users that are banned from this guild.;$usersBanned or $usersBanned[id/mention/username;separator (optional)]",
  $setBotName: "Sets the bot's name.;$setBotName[new name]",
  $isBanned: `Checks if given user ID is banned from the server, returns true or false.;$isBanned[userID]`,
  $modifyChannelPerms: `Modifies the permissions of a channel for given user or role ID.;$modifyChannelPerms[channelID;+perm1;-perm2;/perm3;+perm4;...;roleID/userID]`,
  $loopQueue:
    "Loop the current songs in the queue. Returns whether or not it's looping`;$loopQueue",
  //UPDATE 0.7.0 - DBD.JS :3
  $deleteEmojis:
    "Delete an emoji or emojis from this server.;$deleteEmojis[emoji1;emoji2;...]",
  $serverEmojis: "Returns the emojis of this guild.",
  $emojiCount: "Returns the amount of emojis in this server;$emojiCount[type(normal/animated/all, optional);guildID (optional)]",
  $randomRoleID: "Returns a random role ID from this guild.",
  $findRole:
    "Returns a role ID if the query matches an option.;$findRole[id/name/mention]",
  $cacheMembers:
    "Caches all the members of this guild. (may spike memory usage up);$cacheMembers or $cacheMembers[guildID]",
  $forEachGuildChannel:
    "Loop over every guild channel in this guild executing awaited commands.;$forEachGuildChannel[awaited command 1;awaited command 2;...]",
  $forEachChannel:
    "Loop over every channel this bot can see executing awaited commands.;$forEachChannel[awaited command 1;awaited command 2;...]",
  $forEachUser:
    "Loop over every (cached) user executing awaited commands.;$forEachUser[awaited command 1;awaited command 2;...]",
  $forEachMember:
    "Loop over every (cached) guild member in this guild executing awaited commands.;$forEachMember[awaited command 1;awaited command 2;...]",
  "$forEachGuild[":
    "Loop over every guild this bot's in executing awaited commands.;$forEachGuild[awaited command 1;awaited command 2;...]",
  $isMuted: "Checks if the user is self-muted.;$isMuted[userID]",
  $argsCount: "Returns the amount of user arguments.",
  $messageExists:
    "Checks if a message exists by using its ID;$messageExists[channelID;messageID]",
  $hasEmbeds:
    "Checks if given message ID contains an embed. returns true or false;$hasEmbeds[channelID;messageID]",
  "$clearReaction[":
    "Removes a reaction from given user ID.;$clearReaction[channelID;messageID;userID;emoji]",
  $clearReactions:
    "Clears all the user reactions assigned to one emoji or all the reactions of this message.;$clearReactions[channelID;messageID;all/emoji]",
  $getReactions:
    "Returns a list of users that reacted to this reaction.;$getReactions[channelID;messageID;emoji;mention/username/id]",
  $onlyForCategories:
    "The command will only be executable in channels under one of these category IDs.;$onlyForCategories[categoryID;categoryID2;...;error message]",
  $onlyForChannels:
    "The command will only be executable in the provided channel IDs.;$onlyForChannels[channelID;channelID2;...;error message]",
  $serverRegion: "Return the Guild region",
  $messageType: "Returns the type of this message.",
  $modulo: "Returns the remainder of a division.;$modulo[5;2]",
  $cpu: "Returns the cpu usage.",
  $maxRam: "Total memory for this process.",
  $modifyRole:
    "Modifies a role by using their ID.;$modifyRole[roleID;name;color;mentionable;hoisted]",
  $setStatus:
    "Sets the bot's status.;$setStatus[text;type;status]||$setStatus[$allMembersCount members!;watching;dnd]",
  $channelTopic:
    "Returns the channel topic.;$channelTopic or $channelTopic[channelID]",
  //UPDATE 1.1.0 - DBD.JS :3
  $serverBanner:
    "Returns the Server Banner.;$serverBanner or $serverBanner[guildID;size (optional);dynamic (yes/no)(optional)]",
  $serverBoostLevel: "Return the Level of Server Count:$serverBoostLevel",
  $playSpotify:
    "Play a Spotify playlist;$playSpotify[url;leave vc time; deafen;leave when vc empty (yes/no); useFilter (yes/no, default is yes);error]",
  $skipTo: "Skip to a certain number in the queue;$skipTo[number]",
  $newTicket:
    "Creates a ticket with given options;$newTicket[ticket name;ticket message;categoryID;return ticket ID;error message]",
  $closeTicket:
    "Closes a ticket with given options;$closeTicket[error message]",
  $isMentioned:
    "Checks if the role or channel or user was mentioned / everyone;$isMentioned[userID/roleID/channelID/everyone]",
  $createWebhook:
    "Creates a webhook for this channel, bot has to have manage webhooks permission;$createWebhook[channelID;name;avatar;returnWebhookID&Token (yes/no);separator]",
  $sendWebhook:
    "Sends a message through a webhook by using its ID and token;$sendWebhook[webhookID;webhookToken;message;options...]",
  $referenceChannelID: "The ID of the channel where this user replied in;$referenceChannelID",
  $referenceMessageID: "The ID of the message that the user replied to;$referenceMessageID",
  $referenceGuildID: "The ID of the guild where the user replied in;$referenceGuildID",
  //UPDATE 1.2.0
  $setChannelTopic:
    "Sets the topic of a channel with given ID;$setChannelTopic[channelID;topic]",
  $deleteWebhook:
    "Deletes a webhook by using its token and ID;$deleteWebhook[webhookID;webhookToken]",
  $pinMessage:
    "Pins the user's message or other message using its channel id and message id;$pinMessage or $pinMessage[channelID;messageID]",
  $unpinMessage:
    "Unpins the user's message or other message by using its message and channel id;$unpinMessage or $unpinMessage[channelID;messageID]",
  $getInviteInfo:
    "Gets invite info from given invite code;$getInviteInfo[code/url;maxUses/uses/channelID/guildID/userID/isTemporary/expiresAt/createdAt/url]",
  $channelCategoryID:
    "Returns the ID of the category this channel belongs to;$channelCategoryID or $channelCategoryID[channelID]",
  $commandInfo:
    "Returns a property value of a command by using its name or one of its aliases;$commandInfo[command name;property]",
  $reboot:
    "Restarts the bot, requires the path to the main file.;$reboot[path (optional)]",
  $isUserDMEnabled:
    "Checks if the user has DMs open, returns true or false;$isUserDMEnabled or $isUserDMEnabled[userID]",
  $addMessageReactions:
    "Add reactions to a message by using its channel and message ID;$addMessageReactions[channelID;messageID;reaction1;reaction2;...]",
  $advancedTextSplit: `First field is the message we want to split and get indexes from\nsecond field would be the split used in the text and the next field would get the value of the index, setting this index value as the new text.\nNext fields work as splitter and new index.;$advancedTextSplit[text;split;index;split;index;...]||//in this example we will use a discord message link, we will get the message ID from this link.
  The message ID is $advancedTextSplit[https://discord.com/channels/773352845738115102/773357374328012840/793564340513931285;//;2;/;5]!
  `,
  $packageVersion: "Returns the current package version you have (installed).;$packageVersion",
  $isMentionable:
    "Checks whether the role is mentionable or not;$isMentionable[roleID]",
  $isHoisted:
    "Checks if the role is hoisted above all the other roles;$isHoisted[roleID]",
  $getLeaderboardInfo:
    "beta;$getLeaderboardInfo[variable;id;user/globaluser/server;option]",
  $isManaged:
    "Checks if this role is managed by discord or not;$isManaged[roleID]",
  $isValidHex:
    "Checks if given hex code or int is valid;$isValidHex[int or hex]",
  $webhookExists:
    "Checks if a webhook exists by using its ID and token;$webhookExists[webhookID;webhookToken]",
  $modifyWebhook:
    "Modifies a webhook by using its token and ID;$modifyWebhook[webhookID;webhookToken;name;avatar (optional)]",
  $oldMessage: "The content of the message before it was updated. (if any);$oldMessage",
  $inviteMaxUses: "Max uses for the created / deleted invite.;$inviteMaxUses",
  $fetchInvites:
    "fetches and loops over every invite executing awaited commands;$fetchInvites[awaited command1;awaited command2;...]",
  $isValidLink:
    "Checks if given link is valid or not (might not be accurate);$isValidLink[link or url]",
  $inviteUses: "Returns the amount of uses this invite have.;$inviteUses",
  $inviteChannelID: "Returns the channel ID this invite was created for.;$inviteChannelID",
  $inviteGuildID: "Returns the ID of the guild this invite links to.;$inviteGuildID",
  $inviteUserID: "Returns the invite creator ID.;$inviteUserID",
  $inviteCode: "Returns the code of the invite.;$inviteCode",
  $inviteURL: "Returns the url for this invite.;$inviteURL",
  //$inviteTemporary: "whether if the invite is temporary or not",
  $isDeafened: "Checks if the user is self-deafened.;$isDeafened[userID",
  $playSoundCloud:
    "Play SoundCloud Track URL;$playSoundCloud[url;soundcloud client id (optional);leave vc time;defean (yes or no);leave when vc empty (yes/no);error]",
  //1.3.0
  $getSlashCommandOptions: `Get the options of a slash command using its command name;$getSlashCommandOptions[name] or $getSlashCommandOptions[name;guildID]`,
  $getSlashCommandID: `Get the ID of a slash command by using its name;$getSlashCommandID[name] or $getSlashCommandID[name;guildID/global]`,
  $reply: `Replies to given message ID;$reply[messageID;message;mention (yes/no)]`,
  $modifySlashCommand: `Modify a slash command by using the ID of the guild it belongs to and the ID of the command;$modifySlashCommand[guildID/global;commandID;name;description;options (optional)]`,
  $deleteSlashCommand: `Deletes a slash command from given guild ID, by either using slash command name or ID;$deleteSlashCommand[guildID/global;name/id]`,
  $createSlashCommand: `Creates a slash command for given guild ID, said guild MUST have invited the bot with bot.applications scope authorized, everything after description field is optional;$createSlashCommand[guildID/global;name;description;options;options;...]||
//Create a slash command with one option, that is required
$createSlashCommand[$guildID;say;I'll repeat what u said;message:the message I have to repeat:true:3] Successfully created a slash command! 

/*
* this will create a slash command with name 'say', and one option which is the message to repeat
* options field goes as follow:
* nameOfTheOption:descriptionOfTheOption:isRequired(true/false):optionType(1-8)
* 3 stands for string 
*/
  `,
  $serverSplash:
    "Returns Server Invite Splash;$serverSplash or $serverSplash[guildID;size (optional)]",
  $sendCrosspostingMessage:
    "Sends a message to multiple channels;$sendCrosspostingMessage[message;channelID;channelID;...]",
  $reactionCount: `Returns the amount of people that have given this reaction to this message;$reactionCount[channelID;messageID;emoji]`,
  $botPing: "Returns the Client Latency ms",
  $interactionReply:
    "replies to an interaction (slash command);$interactionReply[content;embeds;components (optional);flags (optional);type (optional)]",
  $clearSongQueue:
    "Clear all songs in queue besides 1st song in queue;$clearSongQueue",
  $messageID: `Returns the user's message ID `,
  //$activityTest: `test`
  //1.5.0  <3
  $serverNames: `Returns the name of every guild you bot is in;$serverNames or $serverNames[separator]`,
  $error: "Returns the error the interpreter threw;$error",
  $executionTime: `Returns the time the interpreter took to execute every function in the code (in milliseconds)\nThis function won't work in embeds`,
  $allEmojiCount: "Returns the total emoji count of all the guilds your bot is in;$allEmojiCount or $allEmojiCount[type]",
  $findMembers:
    "Finds multiple member from this guild through given query and optionally makes a list of members found or chooses one of the list, returning the ID;$findMembers[query;limit (optional);{position} - {username} - {id} (optional);getID (optional)]",
  $vanityUses: `The uses the vanity link of this server have`,
  $vanityURL: `The invite code of the vanity link`,
  $createCollection:
    "Creates a collection with given name, you can store values here, these will be cleared upon bot restart.;$createCollection[name]",
  $if:
    "determines whether given condition is true or false and executes a conditional code if the statement is false or true\nThere can be as many $elseIf as you need, remember these must go in between $if and $else (if $else was used).;$if[value(!=/==/</>/>=/<=)value2]\ncode\nelseIf[value1(==/!=/</>/>=/<=)value2] (optional)\ncode\n$endelseIf (required if using $elseIf)\n$else (optional)\ncode\n$endif (required)||$if[$message[1]==hello]\n$title[Hello $username!]\n$color[GREEN]\n$else\n$title[Please say hello!]\n$color[RED]\n$endif",
  $pruneMusic:
    "Deletes the old Message of Music Start and send the new one to avoid flooding",
  $shuffleQueue: "Shuffle the Queue",
  $replaceTextWithRegex:
    "Uses a regular expression to replace matching queries;$replaceTextWithRegex[text;regex;flags;new text]",
  $oldUser:
    "This function holds data of the old user, used in update user callback, or else any data will be empty.;$oldUser[userOption]",
  $oldPresence:
    "The function that holds old data of the user's presence, used in update presence callback, or else any data will be empty;$oldPresence[presenceOption]",
  $getObject:
    "Returns a JSON of created/modified $createObject;$getObject or $getObject[spaces]",
  $findNumbers:
    "Takes every number from given string and returns them alone;$findNumbers[string]",
  $updateCommands:
    "Updates all the commands of your command handler\nThis function won't be usable if you haven't used our built-in command handler with bot.loadCommands(`./directory/`);$updatecommands",
  $findSpecialChars:
    "Takes all the non number/letter from given string and returns the alone;$findSpecialChars[string]",
  $findChars:
    "Takes all the letters from given string and returns them alone;$findChars[string]",
  $oldRole:
    "Function that holds data of the role before it was updated, used in role update callback, or else any data will be empty;$oldRole[roleOption]",
  $newRole:
    "Function that holds data of a role that was created, updated, or deleted. Used in role update / delete / create callbacks, or else it won't give any data;$newRole[roleOption]",
  $oldChannel:
    "Function that holds data of the channel before it was updated, used in channel update callback, or else any data will be empty;$oldChannel[channelOption]",
  $newChannel:
    "Function that holds data of the updated channel, used in channel update, delete and create callbacks, or else any data will be empty ;$newChannel[channelOption]",
  $year: "Returns current year",
  $day: "Returns current day or date;$day[Return day of the week (yes/no)]",
  $month: "Returns current month",
  $second: "Returns current second",
  $hour: "Returns current hour",
  $minute: "Returns current minute",
  $botOwnerID:
    "Returns the ID of the bot owner\nIf the bot belongs to a team, it'll return multiple IDs\nOptionally, and if there is more than one owner (team), you can input a separator.;$botOwnerID or $botOwnerID[separator]",
  $allChannelsCount:
    "Returns the amount of all the channels of all the guilds your bot is in\nYou can optionally pass types of channels to count;$allChannelsCount or $allChannelsCount[type;type;...]",
  $stringStartsWith:
    "Determines whether given message starts by another message or not;$stringStartsWith[message;text]",
  $deleteMessage:
    "Deletes a message using its ID, if no channel ID is present it'll use the default channel;$deleteMessage[messageID] or $deleteMessage[channelID;messageID]",
  //1.9.4
  $messageWebhookID: "Returns the ID of the webhook that sent this message",
  $messageFlags: "Returns the message flags for this message",
  //2.0.0
  $moveSong:
    "Move song in the queue from x position to z, or remove it from queue if z is invalid;$moveSong[from;to (optional)]",
  $math: "Calculate Numbers instantly;$math[calculation]||$math[8*(7+9)]",
  $channelCooldown:
    "Sets a cooldown to current channel for current command;$channelCooldown[time;error message]",
  $timezone: "Set or return current timezone;$timezone or $timezone[timezone]",
  $moveUser:
    "Move a user from a voice channel or disconnect them;$moveUser[userID;channelID (optional);reason (optional)]",
  $deafenUser:
    "Deafen a user in voice channel;$deafenUser[userID;deafen (yes/no);reason (optional)]",
  $muteUser:
    "Mute a user in voice channel;$muteUser[userID;mute (yes/no);reason (optional)]",
  $editChannel:
    "Edit a guild channel data;$editChannel[channelID;categoryID/$default;name/$default;position/$default;nsfw/$default (yes/no);bitrate/$default;userLimit/$default;syncPermission (yes/no);reason (optional)]",
  $setRoles:
    "Set some roles into guild member;$setRoles[userID;roleID;roleID;...]",
  $loopSong: "Loop current playing song",
  $emojisFromMessage:
    "Returns all the unicode and custom emojis from user arguments or given text;$emojisFromMessage or $emojisFromMessage[text;separator (optional)]",
  $giveRole:
    "Give a role to given user by using the role and user ID;$giveRole[userID;roleID]",
  $takeRole:
    "Remove a role from given user by using the role and user ID;$takeRole[userID;roleID]",
  $highestServerRole: "Returns the ID of the highest role in this server",
  $lowestServerRole: "Returns the ID of the lowest role in this server",
  $lowestRole:
    "Returns the user's lowest role ID in this server;$lowestRole or $lowestRole[userID]",
  $serverDescription: "Returns the server's description",
  $userRoleColor:
    "Returns the user's highest role color hex;$userRoleColor or $userRoleColor[userID]",
  $channelPermissionsFor:
    "Returns the permissions for this user in a channel;$channelPermissionsFor[userID] or $channelPermissionsFor[channelID;userID]",
  $usersTyping:
    "Returns the users that are currently typing in a channel;$usersTyping or $usersTyping[channelID;mention/tag/username (optional);separator (optional)]",
  $booster:
    "Returns raw function if the user is not boosting the official server",
  $userInfo: "Return the user invites info;$userInfo[option;userID (optional)]",
  $resetInvites:
    "Reset the guild or user invites;$resetInvites or $resetInvites[guildID;userID (optional)]",
  $seekTo:
    "Skip a certain amount of duration that the request want to skip (in Seconds);$seekTo[duration (seconds)]||$seekTo[7s] => 7 Seconds of Song Skipped",
  $hasAnyPerm:
    "Checks if an user or author has one of the provided permissions;$hasAnyPerm[permission1;permission2;...] or $hasAnyPerm[userID;permission1;permission2;...]",
  $botLastMessageChannelID:
    "Returns the ID of the last channel the bot sent a message in (if any) (and cached)",
  $botLastMessageID:
    "Returns the ID of the last message sent by the bot (if any) (and cached)",
  $messagePublish:
    "Announces given message to all the channels that follow this channel\nMessages can only be announced / published if they come from a news channel;$messagePublish or $messagePublish[messageID] or $messagePublish[channelID;messageID]",
  $hasAnyRole:
    "Checks if the author or user have at least one of the provided role IDs;$hasAnyRole[roleID1;roleID2;...] or $hasAnyRole[userID;roleID1;roleID2;...]",
  $queueStatus: "Return the current queue status (playing, paused, and idle)",
  $loopStatus: "Return the current queue loop status (song, queue, and none)",
  $isPrune: "Wether or not the queue message is pruned",
  $isTicket:
    "Checks if a channel is a ticket or not;$isTicket or $isTicket[channelID]",
  $roleMembersCount:
    "Returns the amount of users with given role ID.\nThis data comes from the cache, not the api, therefore it may not be precise unless all the guild members are cached.;$roleMembersCount[roleID]",
  $serverExists:
    "Checks if your bot is in given guild ID.;$serverExists[guildID]",
  $songFilter:
    "Set an audio filter to current song;$songFilter[type:value;type:value;...]",
  $createFile:
    "Creates a file containing text inside.;$createFile[text;name.extension]",
  $getChannelSlowmode:
    "Get the slowmode duration of a channel(returns 0 if none).;$getChannelSlowmode or $getChannelSlowmode[channelID]",
  //next update
  $getCollectionKey:
    "Gets a key value from given collection name.;$getCollectionKey[collection name;key]",
  $deleteCollectionKey:
    "Deletes a key from given collection name.;$deleteCollectionKey[collection name;key]",
  $setCollectionKey:
    "Sets a key value to given collection name. Last field will set a timer for this key and will be deleted after the timer is up.;$setCollectionKey[collection name;key;value;timer (optional)]",
  $findCollectionKey:
    "Finds a key by using the key value, third field determines whether the input must be accurate to what the key value contains.;$findCollectionKey[collection name;key value]",
  $getCooldownTime:
    "Gets a command cooldown time left for a type;$getCooldownTime[time;globalUser/user/server/channel/all;command name;ID;return ms (yes/no) (optional)]",
  $timeoutData:
    "Function that holds data for $timeout data parameters, this will be empty if used outside timeoutCommand codes.;$timeoutData[property]",
  $emojiExists:
    "Checks if given emoji ID is available to the bot.;$emojiExists[emojiID]",
  $serverEmojiExists:
    "Checks if given emoji ID is added to this guild.;$serverEmojiExists[emojiID]",
  $setTimeout: `Sets a timeout that will send given data after given duration to timeoutCommands. Third field determines whether the timeout command should send pulse events to timeoutPulseCommands with the timeout data every X time until the timed data is deleted.;$setTimeout[duration;timeout data;timeout heartbeat (duration) (optional)]||//Setting a timeout that will send a message to your dms after given time. 
Bot.command({
    name: "!remindme", 
    code: \`You will be reminded with $messageSlice[1] after $message[1].
$setTimeout[$message[1];
userID: $authorID 
message: $messageSlice[1]] \`
})

Bot.timeoutCommand({
    code: \`$sendDM[$timeoutData[userID];$timeoutData[message]]
\`
})`,
  $spliceTextJoin: `Splits a text by given separator1 and then splits it every X amount of times to then join each splitted array with given separator2 which is then joined with separator3;$spliceTextJoin[text;separator1;separator2;separator3;every]||//Separating user roles in this format:
/*
* Ban | Administrator | Manager Server 
* Kick | Stream | Manage Messages 
* ... 
*/
Your roles:
$spliceTextJoin[$userRoles;,  ; | ;\n;3]
`,
  $removeContains:
    "Deletes every message that includes given words in a channel.;$removeContains[channelID;limit;word1;word2;...]",
  $stringEndsWith:
    "Checks if given message ends with given text;$stringEndsWith[message;text]",
  $memberJoinPosition:
    "Returns member position in the guild.\nNote that all members must be cached in order to be accurate;$memberJoinPosition or $memberJoinPosition[userID]",
  $userReacted:
    "Checks if an user has reacted to a message.;$userReacted[messageID;userID;emoji] or $userReacted[channelID;messageID;userID;emoji]",
  $disableRoleMentions:
    "Disables all role mentions in the bot's message;$disableRoleMentions",
  $userRoleCount:
    "Return the role count of an user ;$userRoleCount or $userRoleCount[userID]",
  $boostingSince:
    "Returns data when given user started boosting this server.;$boostingSince or $boostingSince[userID;date/ms (optional)]",
  //2.2.0 update
  $disableChannelMentions: "Disables all channel mentions in this code",
  $channelOverwrites:
    "Returns the channel permission overwrites;$channelOverwrites or $channelOverwrites[channelID;{mention} ({type}):\\nAllow: {allowed}\\nDeny: {denied};separator]",
  $disableEveryoneMentions: "Disables all mentions with @everyone Role.",
  $abbreviate: "Abbreviate the provided numbers.;$abbreviate[number]",
  '$channel[':
    "A compact function with 18 different functionalities!;$channel[channelID;option]",
  $emoji:
    "A compact function with 10 different functionalities!;$emoji[emojiID;option]",
  $guild:
    "A compact function with 21 different functionalities!;$guild[guildID;option]",
  $msg:
    "A compact function with 20 different functionalities;$msg[messageID;option]",
  $role:
    "A compact funcion with 16 different functionalities;$role[roleID;option]",
  $user:
    "A compact funcion with 12 different functionalities;$user[userID;option]",
  '$client[': `A compact funcion with 15 different functionalities;$client[option]`,
  $ordinal: "Returns the given number as an ordinal number.",
  $isEmoji:
    "Returns true if the content is a default emoji. Returns false otherwise.",
  $webhook:
    "A compact funcion with 10 different functionalities;$webhook[hookID;option]",
  $let:
    "Assigns data to a temporary variable that can be changed and retrieved later in the command. Similar to variables but `$let` values only save per command execution.",
  $get:
    "Returns data from the `$let` function.. Similar to variables but `$get` values only save per command execution.",
  // Next Update
  $formatDate:
    "Formats a Date in Milliseconds / Stringed Date / ISO String to default/given format. Almost a full coverage of moment npm format date, syntax of formats can be found in https://momentjs.com/docs/#/parsing/string-format/;$formatDate[date in ms / string / iso string / javascript convertable date;format]",
  $humanizeMS:
    "Converts Milliseconds into a Readable durations;$humanizeMS[MS;limit (Number) (optional), separator (optional)]",
  // DBD.JS v3 <3 - DBD.jS Team
  $oldMember:
    "Holds data for the member before it was updated, this is from discord cache and might be empty depending on whether it's cached, so use partial option before attempting to access any property. (memberUpdate callback);$oldMember[memberOption]",
  $newMember:
    "Holds data for the member after the update, might be a good idea to check partial option before accessing any property. (memberUpdate callback);$newMember[memberOption]",
  $modifyEmoji:
    "Modifies a emoji from this guild by using its ID.;$modifyEmoji[emojiID;name;...roleIDs (optional)]",
  $resolveEmojiID:
    "Resolves a full emoji / id / name into its ID.;$resolveEmojiID[emoji string/name/id]",
  $exec: "Executes a command on the powershell;$exec[command line]",
  $shutdown: "Shuts the Client down.;$shutdown",
  $hasPermsInChannel:
    "Checks whether a user has given perms in a channel;$hasPermsInChannel[channelID;userID;perm1;perm2;...]",
  $modifyRolePerms:
    "Modifies the permissions of a role, you can also use +all or -al to remove all permissions.;$modifyRolePerms[roleID;+perm1;-perm2;...]",
  $oldState:
    "Holds data for the user voice state before it was updated (voiceStateUpdate callback).;$oldState[voiceStateOption]",
  $getBanReason:
    "Gets the reason a user was banned for.;$getBanReason[userID;guildID (optional)]",
  $isBanned:
    "Checks whether given user ID is banned from a guild.;$isBanned[userID;guildID (optional)]",
  $awaitCmdReaction:
    "Awaits a reaction on the author's message. Note that the reactions must be added by yourself to the message using the standard $addCmdReactions.;$awaitCmdReaction[filter/everyone;time;reaction1,reaction2,...;command1,command2,...;error message (optional)]",
  $serverAvailable:
    "Whether this guild is currently available to discord.;$serverAvailable or $serverAvailable[guildID]",
  $serverPreferredLocale:
    "Returns the preferred locale for this guild.;$serverPreferredLocale or $serverPreferredLocale[guildID]",
  $map:
    "Read about javascript for more information, you can is {value} in the awaited command to return the value of each looped element..;$map[text;splitter;awaited command;separator (optional)]",
  $awaitReactionsUntil:
    "Runs awaited command after given count on a reaction.;$awaitReactionsUntil[channelID;messageID;userFilter/everyone;time;reaction1,reaction2,...;count1,count2,...;command1,command2,...;error (optional)]",
  $rateLimit: "Holds data for rate limit callback.;$rateLimit[rateLimitOption]",
  $filterMessageWords:
    "Removed words from the message.;$filterMessageWords[text;caseSensitive (yes/no);...words]",
  $concatTextSplit:
    "Adds elements to the current textSplit elements.;$concatTextSplit[text;separator]",
  $indexOf:
    "Returns the position of <char> in <text>. Returns 0 if there's no char in text.;$indexOf[text;char]",
  $textSlice:
    "Returns <text> after given position or text in between X and Y;$textSlice[text;x;y (optional)]",
  $newState:
    "Holds data for the user voice state after the update (voiceStateUpdate callback).;$newState[voiceStateOption]",
  $textTrim: "Removes useless spaces from given text.;$textTrim[text]",
  $messageURL: "Returns the message link to this message.",
  $categoryChannels:
    "List channels under a category, or return the count.;$categoryChannels[channelID;option (count/name/mention/id);separator (optional)]",
  $mentionType:
    "Uses an argument to determine the type of the mention (role, user, channel or none).;$mentionType[mention argument]",
  $mutualServers:
    "Check mutual servers of the specified user.;$mutualServers or $mutualServers[userID;separator]",
  $cropText:
    "Crop the specified text until the limit.;$cropText[text;limit;charToSplit (optional);append (optional)]",
  $httpRequest:
    "Request using http protocol into a URL;$httpRequest[url;method (optional) (default to get);body (optional);property (optional) (if response is json);error (optional);headerName:headerValue (optional);headerName:headerValue (optional);...]",
  $hoistedRole:
    "Return the last hoisted role of the user.;$hoistedRole or $hoistedRole[userID]",
  $createVar:
    "Create some variables.;$createVar[varName:varValue;varName:varValue;...]",
  $deleteUserVar:
    "Delete a local user var from database.;$deleteUserVar[variable;userID (optional);guildID (optional)]",
  $deleteGlobalUserVar:
    "Delete a global user var from database.;$deleteGlobalUserVar[variable;userID (optional)]",
  $deleteServerVar:
    "Delete a server var from database.;$deleteServerVar[variable;guildID (optional)]",
  $deleteChannelVar:
    "Delete a channel var from database.;$deleteChannelVar[variable;channelID (optional)]",
  $deleteMessageVar:
    "Delete a message var from database.;$deleteMessageVar[variable;messageID (optional)]",
  $lavalinkExecute: `Lavalink compact functions with methods.`,
  //New Updates
  $mfaLevel:
    "Return the guild mfa level (true or false);$mfaLevel or $mfaLevel[guildID]",
  $isValidImageLink:
    "Return true if the provided link is an image otherwise false;$isValidImageLink[link]",
  $complexCooldown:
    "Set a cooldown for all, channel, server, globalUser, or user depends on type;$complexCooldown[type;time;error]",
  $resolveColor:
    "Convert's RGB Color/ Basic Color's into Hex or Color Number.;$resolveColor[red;green;blue;toHex (yes or no) (optional) (default to yes);type (rgb / number) (default to rgb)]",
  $parseTime: "Parse human readable time into milliseconds;$parseTime[time]",
  $joinVC: "Make the bot join a voice channel.;$joinVC[channelID]",
  $leaveVC: "Make the bot leave from voice channel, if any.;$leaveVC",
  //Aoi.JS <3
  $dbPing: "Returns the Database Ping;$dbPing",
  $defaultMessageNotifications: "Return the guild default message notification level (All or Mentions).;$defaultMessageNotifications or $defaultMessageNotifications[guildID]",
  $maximumMembers: "Return the maximum members can join the server;$maximumMembers or $maximumMembers[guildID]",
  $killClient: "Destroy the client gateway connection.;$killClient",
  $clientToken: "Return the client token;$clientToken",
  $uri: "Decodes or Encodes a url Example when you encode a url 'hello world' = 'hello%20world';$uri[decode/encode;text]",
  $variablesCount: "Returns amount of bot variables the bot has.;$variablesCount",
  $isEveryoneMentioned: "Returns true/false if @everyone was mentioned in the command.;$isEveryoneMentioned",
  $mentionedRolesCount: "Returns amount of mentioned roles in the command's message.;$mentionedRolesCount",
  $mentionedUsersCount: "Returns amount of mentioned users in the command's message.;$mentionedUsersCount",
  $mentionedChannelsCount: "Returns amount of mentioned channels in the command's message.;$mentionedChannelsCount",
  $ms: "Converts ms or duration as an example of \"1w\" to ms or duration",
  $randomEmoji: "Returns a random custom emoji from Guild/global;$randomEmoji or $randomEmoji[guildId/global]",
  $getAuditLogs: "Returns audit log information, every field is optional, action default to everything;$getAuditLogs[limit;userID;action;guildID;format]",
  $nodeVersion: "Return Node.js version;$nodeVersion",
  $pruneMembers: "Prunes members with role for a certain amount of time;$pruneMembers[amount of days(optional, defaults to 7);guildID(optional);reason(optional, defaults to none);roleid1:roleid2:roleid3...]",
  $pruneStatus: "Return an amount of members that can be pruned;$pruneMembers[amount of days(optional, defaults to 7);guildID(optional);roleid1:roleid2:roleid3...]",
  $clientApplication: "Returns information from client application;$clientApplication[properties]",
  $oldGuild: "Holds data for the guild before it was updated, this is from discord cache and might be empty depending on whether it's cached, so use partial option before attempting to access any property. (guildUpdate callback);$oldGuild[guildOption]",
  $newGuild: "Holds data for the guild after the update, might be a good idea to check partial option before accessing any property. (guildUpdate callback);$newGuild[guildOption]",
  $oldEmoji: "Holds data for the emoji before it was updated/ deleted. (emojiUpdate and emojiDelete callback);$oldEmoji[emojiOption]",
  $newEmoji: "Holds data for the emoji after the creation/ update. (emojiCreate and emojiUpdate callback);$newEmoji[emojiOption]",
  $pinsUpdate: "Holds data for the channel the channel pins were updated in. (channelPinsUpdate callback);$pinsUpdate[pinsUpdateOption]",
  $webhookUpdate: "Holds data for the channel the webhook was updated in. (webhookUpdate callback);$webhookUpdate[webhookUpdateOption]",
  $bulk: "Holds data for the bulk delete command. (messageDeleteBulk callback);$bulk[bulkOption]",
  $editGuild: "A compact function to edit different server settings.;$editGuild[option;result;guildID (optional)]",
  $fileSize : "Returns the size Of file in The project In the Provided Unit;$fileSize[file location;units] \n units: b, kb , mb , gb",
  $getAttachments: "Gets attachment info of the provided Message; $getAttachments[channelID;messageID;position;property] \n property: name , id , size , height , width , url",
  $sendTTS: "send a tts message in the current channel (optional);$sendTTS[text] or $sendTTS[text;channelID]" ,
  $writeFile: "writes a text in the provided file. If file doesn't exist , it will create it.;$writeFile[file location;text; encoding (optional)]",
  $readFile: "returns the data of the file;$readFile[file location]",
  $renameFile: "renames the provided file;$renameFile[oldname;newname]",
  $serverLeaderboard: "returns a learderboard of servers of the provided variable;$serverLeaderboard[variable;asc/desc(optional);{top}. {servername}. {value} (optional);list(optional);page(optional)]",
  $vcSize : "returns the size of the provided type in Provided guild or global;$vcSize[channels/users/songs;guildID/global (optional)]",
  $handleError: "function that is used in onFunctionError callback;$handleError[option]",
  $oldVariable: "gets the data from variable Callbacks (update and delete one);$oldVariable[variable options]",
  $newVariable: "gets the data from variable Callbacks (Update and Create one);$newVariable[variable options]",
  $oldApplicationCmd: "gets the data from application Callbacks (update and delete one);$oldApplicationCmd[application options]",
  $newApplicationCmd: "gets the data from application Callbacks (update and create one);$newApplicationCmd[application options]",
  $interactionData : "gets the data when an interaction was created (onInteractionCreate); $interactionData[property]",
  $filterTextSplitElement : "filters the elements in textsplit with provided query and given type (types : equal, includes, starts,ends);$filterTextSplitElement[query;type (optional); separator (optional)]",
  $apiMessage: "sends a message using Discord api;$apiMessage[channelID;content;embed (optional); components (optional); reference _message_id:mention the replied user(default false); Return id (optional default no)]",
  $awaitButtons: "awaits buttons for given amount of uses;$awaitButtons[msgid;userfilter; customID, customID,...; awaitcommand, awaitedcommand,...; error content,Error embed,erorr flags (optional);uses (optional : default 1)]",
  $buttonCollector: "creates a collector for given customIDs;$buttonCollector[messageID;everyone/userID;time;customID,customID,...;awaitedcommand,awaitedcommand,...;error msg content,error msg embed,error msg flags (64 for ephemeral) (optional); awaitedcommand (executes when collector ends)(optional)]",
  $interactionEdit:"edits the original interaction Response;$interactionEdit[content;embeds; components]",
  $interactionDelete:"deletes the original interaction Response (doesn't support ephemeral messages)",
  $firstMessageID: "Returns First message's ID from the current channel or in given channel;$firstMessageID or $firstMessageID[channelID]",
  $randomCase: "Generates the given text with Random cases;$randomCase[text]",
  $reverse: "Converts the given characters into reverse order;$reverse[text or characters]",
  $voiceMembersCount: "Returns all members count inside all voice channels;$voiceMembersCount or $voiceMembersCount[guildID (optional)]",
  $packageName: "Returns the current package name.;$packageName"
};
module.exports = Parser;
