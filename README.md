<p align="center">
  <a href="https://aoi.js.org">
    <img width="300" src="https://github.com/aoijs/website/blob/master/assets/images/aoijs-banner.png?raw=true" alt="aoijs">
  </a>
</p>

<div align="center">
  <b>The most powerful string package to create a simple and fast Discord Bot.</b>
</div>

---

<br/>

<div align="center">

[![NPM downloads][download-image]][download-url] &nbsp; &nbsp;
[![AoiJS Server][aoijs-server]][aoijs-server-url] &nbsp; &nbsp;
[![NPM version][npm-image]][npm-url] &nbsp; &nbsp;
![License](https://img.shields.io/npm/l/aoi.js) &nbsp; &nbsp;
![Website](https://img.shields.io/website?url=https%3A%2F%2Faoi.js.org&label=aoi.js.org) &nbsp; &nbsp;

[npm-image]: https://img.shields.io/npm/v/aoi.js.svg?color=42cfff
[npm-url]: https://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?color=3182b0
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://discord.gg/HMUfMXDQsV

  </div>

<br />

<div align = "center">

**[ Documentation ](https://aoi.js.org/docs/)** | **[ Support Server ](https://discord.gg/HMUfMXDQsV)** | **[ Website ](https://aoi.js.org/)** | **[ NPM ](https://npmjs.org/package/aoi.js)** | **[ GitHub ](https://github.com/akaruidevelopment/aoi.js)**

</div>

---

## About

aoi.js is a JavaScript library that is designed to make it easy to build Discord bots.

It is open-source and free to use, and provides a simple, easy-to-use interface for interacting with the Discord API and handling events.

aoi.js is suitable for beginners who are new to building bots, as well as experienced developers who want to save time and streamline their workflow.

## Features

- **600+ Pre-built Functions:** aoi.js comes packed with over 600 pre-built functions that empower you to create dynamic and interactive Discord bots with ease.
- **Built-in Custom Local Database:** With aoi.js, you get a powerful custom local database out of the box. You can also seamlessly integrate popular databases like MongoDB and SQL for more advanced data management.
- **Extensions for Added Functionality:** Enhance your bot's capabilities with aoi.js extensions like aoi.music and aoi.panel. These extensions make it simple to add music playback, interactive panels, and more to your bot.
- **Easy-to-Use and Beginner Friendly:** aoi.js boasts a user-friendly syntax that is perfect for beginners. The simple `$` prefix makes it easy to write commands and get your bot up and running quickly.


## Setup

```javascript
const {AoiClient} = require("aoi.js");

const bot = new AoiClient({
    token: "DISCORD BOT TOKEN",
    prefix: "DISCORD BOT PREFIX",
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage"],
    database: {
        type: "aoi.db",
        db: require("@akarui/aoi.db"),
        tables: ["main"],
        path: "./database/",
        extraOptions: {
            dbType: "KeyValue"
        }
    }
});

// Ping Command
bot.command({
    name: "ping",
    code: `Pong! $pingms`
});
```

### Interaction Command Setup

```javascript
const {AoiClient} = require("aoi.js");

const bot = new AoiClient({
    token: "DISCORD BOT TOKEN",
    prefix: "DISCORD BOT PREFIX",
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    database: {
        type: "aoi.db",
        db: require("@akarui/aoi.db"),
        tables: ["main"],
        path: "./database/",
        extraOptions: {
            dbType: "KeyValue"
        }
    }
});

// Create Interaction Ping
bot.command({
    name: "create",
    code: `$createApplicationCommand[$guildID;ping;Pong!;true;slash]`
});

// Ping Interaction Command

bot.interactionCommand({
    name: "ping",
    prototype: "slash",
    code: `$interactionReply[Pong! $pingms;;;;everyone;false]`
});
```

## Contribution

[Refer to contribution documentation for more information](https://github.com/AkaruiDevelopment/aoi.js/blob/v6/.github/CONTRIBUTING.md)

## License

aoi.js is licensed under the [Apache License 2.0](./LICENSE).
