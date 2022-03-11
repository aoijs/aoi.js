<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js</h1>

<div align="center">

**The most advanced package to create a Discord Bot fast and powerful.**
    
[![NPM version][npm-image]][npm-url]
[![AoiJS Server][aoijs-server]][aoijs-server-url]
[![NPM downloads][download-image]][download-url]

The replacement of [dbd.js](https://www.npmjs.com/package/dbd.js)

[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite
    
</div>

## Features

- Built-in support of Music Functions
- Built-in support of Multiple interactions commands
- Built-in support of Custom Functions Integrated
- 500+ built-in functions available

## Installation

**Node.JS 16.6.0 or newer is required.**  


```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Example usage

```js
const aoijs = require("aoi.js")

const bot = new aoijs.Bot({
token: "DISCRD BOT TOKEN",
prefix: "DISCRD BOT PREFIX",
intents: ["GUILDS", "GUILD_MESSAGES"]
})

//Events
bot.onMessage()

//Command Example (ping)
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

### Optional Packages


- [@akarui/aoi.music](https://www.npmjs.com/package/@akarui/aoi.music) for Music Functions to function (`npm install @akarui/aoi.music`)
- [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) for allowing Music Filters to run smoothly (`npm install ffmpeg-static`)

## Made Possible by Akarui Development

<p align="center">
  <a href="https://aoi.js.org/invite">
    <img width="350" src="https://cdn.discordapp.com/attachments/804813961190572093/909447704978001931/Akarui_Development_Banner.png">
  </a>
</p>

<div align="center">  

**A Development Team with experienced Developers, created by [Leref](https://leref.ga) creating easy and simple packages**

</div>
    
## Links
- [Website](https://aoi.js.org)
- [NPM](https://www.npmjs.com/package/aoi.js)
- [Github](https://github.com/AkaruiDevelopment/aoi.js)
- [Discord Server](https://discord.gg/HMUfMXDQsV)
- [Documentation](https://akarui.leref.ga/v/aoi.js/)
