  <br />
    <p>
    <a href="https://dbd.js.org/invite"><img src="https://cdn.discordapp.com/attachments/804505461076131840/837194632148287509/Aoi.js_6_ver._2.png" alt="aoi.js" /></a>
  </p>

# Aoi.JS
[![NPM Downloads](https://img.shields.io/npm/dt/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)
[![Discord Server](https://img.shields.io/discord/773352845738115102?color=7289da&logo=discord&logoColor=white)](https://dbd.js.org/invite)

## Table Of Contents
- [About](#about)
  - [Setup](#setup)
  - [Variables](#variables)
  - [Events / Callbacks](#callbacks)
- [Additional Support](#methods)
  - [Slash Commands](#slash-commands)
  - [Music](#music)
- [Links](#links)
- [Contributing](#contributing)


## About
Aoi.JS is a package with simplified and ready-to-use functions for Discord Bot Developers to develop their own Discord Bots.

Aiming to be the easiest package to learn <br>
It's swift and flexible using functions. </br>

 Open Source for the Community ❤️ <br>
 </br>

## Examples

### Setup
```js
const Aoijs = require("aoi.js")

const bot = new Aoijs.Bot({
token: "TOKEN", //Discord Bot Token
prefix: "!" //Customizable
})
bot.onMessage() //Allows to run Commands

bot.command({
name: "ping", //Trigger name (command name)
code: `$ping Pong!` //Code
})
```

### Variables

What are variables?

Variables are Key-Value based data which is stored in the database, useful for Economy and Leveling system as it is allows you to save data.

```js
bot.variables({
  VariableName1: "Value", //Returns "Value"
  VariableName2: "Value2" //Returns "Value2"
})
```

### Callbacks

What are callbacks?

It's simple and easy process, it essentially allows you to trigger events, such as user joining a Guild.
This will trigger an event, causing commands with supported type for each callbacks to be executed such as.

```js
bot.joinCommand({
        channel: "Channel ID", //Enter a Channel ID
        code: `<@$authorID> just joined, welcome!` //This can be changed
})
bot.onJoined()
```

## Additional Support

### Slash Commands

With easy and simple functions, you can make Slash Commands with your Bots quick!

```js
bot.command({
    name: "slash",
    code: `$createSlashCommand[$guildID;version;Returns Aoi.js Version]`
})
bot.interactionCommand({
    name: "version", 
    code: `$interactionReply[$packageVersion]`
})
bot.onInteractionCreate()
```

More Information in our [Documentation](https://aoi.leref.ga/guide/slash-commands)

#### Music

With our powerful Package, we incorporated Music with several functions.
We allowed customization and control over what you want.


#### Music Setup Example

```js
bot.command({
name: "play", //Trigger name (command name)
code: `$playSong[Music Name;Something went wrong!]`
//Code
})
```

More Information in our [Documentation](https://aoi.leref.ga/guide/music)

## Links
Aoi.JS was made by [Aoi.JS Team](https://discord.gg/HMUfMXDQsV)
- [Website](https://aoi.js.org)
- [Discord Server](https://dbd.js.org/invite)
- [Documentation](https://aoi.leref.ga)

## Contributing
Please read [Contributing](https://github.com/aoijs/aoi.js/blob/master/.github/CONTRIBUTING.md)
