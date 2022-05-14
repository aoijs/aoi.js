<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**シンプルで高速なDiscord Botを作成するための最も強力な文字列パッケージです。**

[![NPM version][npm-image]][npm-url]
[![NPM downloads][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js

[Preview](https://aoi.js.org/docs/example.md)

[English](./README.md) | Japanese | [Spanish](./README-spanish.md)

</div>

## 特徴

- パワフルな機能とシンプルな使いやすさを両立。
- TypeScriptで書かれており、簡単に機能的なエラーを提供することができます。
- [Akarui Development](https://github.com/AkaruiDevelopment/)のサイドローディングでサポートされるいくつかの拡張機能を更新しました。

## インストール

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
