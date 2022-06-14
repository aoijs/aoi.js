<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**Самый мощный пакет для просто и быстрого создания мощного Discord бота**

[![NPM версия][npm-image]][npm-url]
[![AoiJS сервер][aoijs-server]][aoijs-server-url]
[![NPM загрузки][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite

[Превью](https://aoi.js.org/docs/example.md)

[English](./README.md) | [Japanese](./README-jp.md) | [Spanish](./README-spanish.md) | Русский

</div>

## Преимущества

- Мощные встроенные функции с лёгким использование.
- Написан на TypeScript позволяющий легко искать ошибки в функциях.
- Обновлено с использованием множества дополнений от [Akarui Development](https://github.com/AkaruiDevelopment/). 

## Установка

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Пример 

```javascript
const { AoiClient } = require("aoi.js");

const bot = new AoiClient({
    token: "DISCORD БОТ ТОКЕН",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefix: "DISCORD БОТ ПРЕФИКС"
})

bot.addEvent("onMessage")

bot.commands.add("basicCommand", {
    name: "ping",
    code: `Понг! $pingms`
})

bot.start()
```
