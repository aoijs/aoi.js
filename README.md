  <br />
    <p>
    <a href="(https://aoi.leref.ga"><img src="https://aoi.js.org/assets/images/aoijs-new.png" alt="aoi.js" /></a>
  </p>

# Aoi.JS
[![Discord Server](https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white)](https://aoi.js.org/invite)
[![NPM Version](https://img.shields.io/npm/v/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)
[![NPM Downloads](https://img.shields.io/npm/dt/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)

## Table Of Contents
- [About](#about)
  - [Setup](#setup)
  - [Variables](#variables)
  - [Events / Callbacks](#callbacks)
- [Additional Support](#additional-support)
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
 
## Installation

**Node.js 12.0.0 or newer is required.**  

```sh-session
npm install aoi.js
```

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

bot.readyCommand({
    channel: "", //You can use this or not.
    code: `$log[Ready on $userTag[$clientID]]` //Enter the code / message.
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

### Additional Support

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
- [Discord Server](https://aoi.js.org/invite)
- [Documentation](https://aoi.leref.ga)

## Contributing
Please read [Contributing](https://github.com/aoijs/aoi.js/blob/master/.github/CONTRIBUTING.md)
