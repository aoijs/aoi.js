<p align="center">
  <a href="https://aoi.js.org">
    <img width="200" src="https://cdn.discordapp.com/attachments/804813961190572093/924765606056701952/aoits.png">
  </a>
</p>

<h1 align="center">aoi.js v6</h1>

<div align="center">

**A biblioteca mais poderosa para criar um bot do Discord, simples e rápido.**
  
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

[English](./README.md) | [Japanese](./README-jp.md) | [Spanish](./README-spanish.md) | Português

</div>

## Recursos

- Poderosas funções integradas com usos simples.
- Escrito em TypeScript para fornecer facilmente erros funcionais.
- Atualizado com várias extensões supotadas pelo [Akarui Development](https://github.com/AkaruiDevelopment/) sideloading. 

## Instalação 

```bash
npm install aoi.js
``` 

```bash
yarn add aoi.js
```

## Exemplo

```javascript
const { AoiClient } = require("aoi.js");

const bot = new AoiClient({
    token: "TOKEN DO SEU BOT",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefix: "PREFIXO DO SEU BOT"
})  

bot.addEvent("onMessage")

bot.commands.add("commandoBasico", {
    name: "ping",
    code: `Pong! $pingms`
})

bot.start()
```
