<p align="center">
  <a href="https://aoi.js.org">
    <img width="300" src="https://cdn.discordapp.com/attachments/1058843428831629443/1063251770228342895/aoijsbanner.png" alt="aoijs">
  </a>
</p>

<h1 align="center">aoi.js</h1>

<div align="center">

**The most powerful string package to create a simple and fast Discord Bot.**

[![NPM downloads][download-image]][download-url]
[![AoiJS Server][aoijs-server]][aoijs-server-url]
[![NPM version][npm-image]][npm-url]

[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?color=42cfff
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?color=3182b0
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite

[View Documentation](https://aoi.js.org/docs/)

</div>

## Installation

**node.js 16.9.0 or newer is required.**

```bash
npm install aoi.js
yarn add aoi.js
```

## Setup

```javascript
const { AoiClient } = require("aoi.js")

const bot = new AoiClient({
token: "Discord Bot Token",
prefix: "Discord Bot Prefix",
intents: ["MessageContent", "Guilds", "GuildMessages"],
events: ["onMessage"]
})

//Ping Command Example
bot.command({
name: "ping",
code: `Pong! $pingms`
})

bot.start()
```

## Links
- [Website](https://aoi.js.org)
- [NPM](https://www.npmjs.com/package/aoi.js)
- [Github](https://github.com/AkaruiDevelopment/aoi.js)
- [Discord Support Server](https://discord.gg/HMUfMXDQsV)
- [Documentation](https://aoi.js.org/docs/)
