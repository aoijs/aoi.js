# aoi.js

  <br />
    <p>
    <a href="https://aoi.leref.ga"><img src="https://aoi.js.org/assets/images/aoijs-new.png" alt="aoi.js" /></a>
  </p>

[![Discord Server](https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white)](https://aoi.js.org/invite)
[![NPM Version](https://img.shields.io/npm/v/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)
[![NPM Downloads](https://img.shields.io/npm/dt/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)

## About
aoi.js is a package with customization and ready-to-use functions to make Discord Bots with ease.

- Built-in support of multiple interactions commands
- Built-in support of Custom Functions Integrated
- Optimized and customizable
- 500+ functions available

The replacement of [dbd.js](https://www.npmjs.com/package/dbd.js)

## Installation

**Node.JS 16.6.0 or newer is required.**  

```sh-session
npm install aoi.js
```

## Setting up

```js
const aoijs = require("aoi.js")

const bot = new aoijs.Bot({
token: "TOKEN", //Discord Bot Token
prefix: "PREFIX", //Discord Bot Prefix
intents: ["GUILDS", "GUILD_MESSAGES"] //Discord Intents
})

//Events
bot.onMessage()

//Command Example
bot.command({
name: "ping",
code: `Pong! $pingms`
})

//Ready Event
bot.readyCommand({
    channel: "",
    code: `$log[Ready on $userTag[$clientID]]`
})
```

## Custom Functions for Intermediate Developers
With the latest feature of aoi.js v5.0.0 and above, which enables Developers to create their own custom function built-in and easy.

```js
/*THIS IS JUST AN EXAMPLE IN YOUR MAIN FILE*/

const aoijs = require("aoi.js")

const bot = new aoijs.Bot({
    token: "TOKEN", //Discord Bot Token
    prefix: "PREFIX", //Discord Bot Prefix
    intents: ["GUILDS", "GUILD_MESSAGES"] //Discord Intents
})

//Events
bot.onMessage()

/*CREATING THE ACTUAL FUNCTION*/

bot.functionManager.createCustomFunction({
name : '$authorOnlyButton', //FUNCTION NAME 
params : ['index','label','style','customId','disabled','emoji'],//THE TYPE OF PARAMS
type : 'aoi.js', //TYPE METHOD
code : ` 
$addButton[{index};{label};{style};{customId}_$authorId;{disabled};{emoji}]
` //THE ACTUAL CODE IT WILL BE RETURN
})

/*ONLY EXPERIENCED WITH UNDERSTANDING OF AOIJS SHOULD USE*/

/*BY USING CUSTOM FUNCTION WE ARE'T OBLIGED OF WHAT HAPPENS TO YOUR CLIENT*/

/*WITH THIS FUNCTION MANAGER IT JUST CREATED $authorOnlyButton function*/
```

### Optional packages
- [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) for allowing Music Filters to run smoothly (`npm install ffmpeg-static`)

## Akarui Development

  <br />
    <p>
    <a href="https://aoi.js.org/invite"><img src="https://cdn.discordapp.com/attachments/804813961190572093/909447704978001931/Akarui_Development_Banner.png" alt="akarui" /></a>
  </p>

-  A Team managed by [Leref](https://leref.ga/) that oriented by NPM Packages Support by the Team.
- In charge of development of aoi.js

## Links
- [Website](https://aoi.js.org)
- [NPM](https://www.npmjs.com/package/aoi.js)
- [Github](https://github.com/AkaruiDevelopment/aoi.js)
- [Discord Server](https://discord.gg/HMUfMXDQsV)
- [Documentation](https://akarui.leref.ga/v/aoi.js/)

## Open Source

aoi.js is available and open source for the community to explore and contribute for future updates.

Please read [Contributing](https://github.com/AkaruiDevelopment/aoi.js/blob/main/.github/CONTRIBUTING.md)