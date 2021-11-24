v5.0.4
```diff
# Misc Changes
!renamed package to src
!formatted class and handler folder
+index.js to .gitignore
!fixed allowedMentions in Intepreter
!changed default content from '' to ' ' , now u can use {newEmbed:} directly in functions like $editIn etc

# Bot Class Changes
+rateLimitCommand()
+onRateLimit()

+webhookUpdateCommand()
+onWebhookUpdate()

# Function Changes
!fixed $awaitCmdReactions
!fixed $argsCheck not stoping the execution 
!added line to convert number strings to number in condition, now  >= and <= should work

-$ServerEmojis[guildId?]
+$serverEmoji[separator?;guildId?]

-$authorBanner 
+$authorBanner | $authorBanner[size?;dynamic?;format?]

!added support for aliases in $commandInfo
!fixed typo in $forEachGuildChannel
!fixed $math (finally)

-$getUserBanner 
+$getUserBanner | $getUserBanner[userId;size?;dynamic?;format?]

-$createServerInvite[channelId;options...]
+$createServerInvite[guildId;options...]

+$createChannelInvite[channelId;otpions...]

-$modifyCHannelPErms[roleId/userId;channelId;guildId;perms;perm;perm;...]
+$modifyCHannelPErms[roleId/userId;channelId;perms;perm;perm;...]

!fixed $moveUser

+endAwaitCmd for all FOrEach function

!fixed $randomText returning only value of one randomText even if fields are different