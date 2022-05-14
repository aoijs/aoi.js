<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**The most powerful string package to create a simple and fast Discord Bot.**

[![NPM version][npm-image]][npm-url]
[![NPM downloads][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js

[Preview](https://aoi.js.org/docs/example.md)

[English](./README.md) | [Japanese](./README-jp.md) | Spanish
</div>

## Features

- Powerful built-in made functions with simple usages.
- Writen in TypeScript to easily provide functional errors.
- Updated with several extensions supported from [Akarui Development](https://github.com/AkaruiDevelopment/) sideloading. 

## Install

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Example 

```javascript
const { AoiClient } = require("aoi.js");

const bot = new AoiClient({
    token: "DISCORD BOT TOKEN",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefix: "DISCORD BOT PREFIX"
})

bot.addEvent("onMessage")

bot.commands.add("basicCommand", {
    name: "ping",
    code: `Pong! $pingms`
})

bot.start()
```
