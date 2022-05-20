<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**सबसे शक्तिशाली string package जिससे एक आसान और तेज़ Discord Bot बनाया जा सकता है।**

[![NPM version][npm-image]][npm-url]
[![AoiJS Server][aoijs-server]][aoijs-server-url]
[![NPM downloads][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite

[Preview](https://aoi.js.org/docs/example.md)

[English](./README.md) | [Japanese](./README-jp.md) | [Spanish](./README-spanish.md) | Hindi

</div>

## इनके गुण

- शक्तिशाली अपने आप में बने हुए functions है जिन्हें उपयोग करना बहुत आसान है।
- यह TypeScript में लिखा हुआ है जिससे functional errors के प्रति आसान मद्द दिया जा सके।
- बहुत से extensions के साथ अपडेटेड है जिससे [Akarui Development](https://github.com/AkaruiDevelopment/) अपने sideloading के माध्यम से मद्द कर रहे हैं। 

## इंस्टॉल

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## उदाहरण 

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
