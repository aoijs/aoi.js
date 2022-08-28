<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**El paquete npm más poderoso de texto para crear un bot de Discord simple y rápidamente.**

[![NPM version][npm-image]][npm-url]
[![NPM downloads][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js

[Preview](https://aoi.js.org/docs/example.md)

[English](./README.md) | [Japanese](./README-jp.md) | Spanish
</div>

## Características 

- Funciones pre-programadas de poderoso pero simple uso.
- Escrito en TypeScript para avisar de posibles errores.
- Actualizado con extensiones entregadas por [Akarui Development](https://github.com/AkaruiDevelopment/). 

## Instalación 

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Ejemplo

```javascript
const { AoiClient } = require("aoi.js");

const bot = new AoiClient({
    token: "TOKEN DEL BOT DE DISCORD",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefix: "PREFIJO DEL BOT"
})

bot.addEvent("onMessage")

bot.commands.add("basicCommand", {
    name: "ping",
    code: `Pong! $pingms`
})

bot.start()
```
