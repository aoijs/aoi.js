<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**La librería más poderosa para crear un Discord Bot de forma simple y rápida.**

[![Versión (NPM)][npm-image]][npm-url]
[![Descarga (NPM)][download-image]][download-url]


[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js

[Preview](https://aoi.js.org/docs/example.md)

[English](./README.md) | [Japanese](./README-jp.md) | Spanish(./README-spanish.md)
</div>

## Funcionalidades

- Potentes funciones integradas con usos simples.
- Escrito en TypeScript para proporcionar fácilmente errores funcionales.
- Actualizado con varias extensiones compatibles con [Akarui Development](https://github.com/AkaruiDevelopment/). 

## Instalación

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Ejemplos: 

```javascript
const { AoiClient } = require("aoi.js");

const bot = new AoiClient({
    token: "TOKEN DEL BOT DE DISCORD",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefix: "PREFIX DEL BOT DE DISCORD"
})

bot.addEvent("onMessage")

bot.commands.add("basicCommand", {
    name: "ping",
    code: `Pong! $pingms`
})

bot.start()
```
