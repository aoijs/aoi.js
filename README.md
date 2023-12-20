<p align="center">
  <a href="https://aoi.js.org">
    <img width="500" src="https://github.com/aoijs/website/blob/master/assets/images/aoijs-banner.png?raw=true" alt="aoijs">
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

**[ Documentation ](https://aoi.js.org/)** | **[ Support Server ](https://discord.gg/HMUfMXDQsV)** | **[ NPM ](https://npmjs.org/package/aoi.js)** | **[ GitHub ](https://github.com/akaruidevelopment/aoi.js)**

</div>

---

## About

aoi.js is a JavaScript library that is designed to make it easy to build Discord bots.

It is open-source and free to use, and provides a simple, easy-to-use interface for interacting with the Discord API and
handling events.

aoi.js is suitable for beginners who are new to building bots, as well as experienced developers who want to save time
and streamline their workflow.

## Features

- **600+ Pre-built Functions:** aoi.js comes packed with over 600 pre-built functions that empower you to create dynamic
  and interactive Discord bots with ease.
- **Built-in Custom Local Database:** With aoi.js, you get a powerful custom local database out of the box.
- **Extensions for Added Functionality:** Enhance your bots capabilities with aoi.js extensions like aoi.music and
  aoi.panel. These extensions make it simple to add music playback, interactive panels, and more to your bot.
- **Easy-to-Use and Beginner Friendly:** aoi.js boasts a user-friendly syntax that is perfect for beginners. The
  simple `$` prefix makes it easy to write commands and get your bot up and running quickly.

## Setup

```javascript
const {AoiClient} = require("aoi.js");

const client = new AoiClient({
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    prefix: "Discord Bot Prefix",
    token: "Discord Bot Token"
});

// Ping Command
client.command({
    name: "ping",
    code: `Pong! $pingms`
});
```

### Adding Database

```javascript
const {AoiClient} = require("aoi.js");

const client = new AoiClient({
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    prefix: "Discord Bot Prefix",
    token: "Discord Bot Token",
    database: {
        type: "aoi.db",
        db: require("@akarui/aoi.db"),
        dbType: "KeyValue",
        tables: ["main"],
        securityKey: "a-32-characters-long-string-here",
    }
});

// Ping Command
client.command({
    name: "ping",
    code: `Pong! $pingms`
});
```

## Command Handler

By default, aoi.js does not have a command handler. However, you can easily add one by using the `loadCommands` method.

```javascript
client.loadCommands("./commands/", true);
```

- `./commands/` is the directory where your commands are located.
- `true` allows to log the commands in console.

## Notices

- **Reading Functions**: Currently it reads `$` functions from bottom to top.

## Official Extensions

<div align="center">
  <a href="https://aoi.js.org/extensions/aoipanel">
    <img width="100" src="https://github.com/aoijs/website/blob/master/assets/images/aoipanel.png?raw=true" alt="@akarui/aoi.panel">
  </a>
  <a href="https://aoi.js.org/extensions/aoimusic">
    <img width="100" src="https://github.com/aoijs/website/blob/master/assets/images/aoimusic.png?raw=true" alt="@akarui/aoi.music">
  </a>
</div>

## Contributing

[Refer to contribution documentation for more information](https://github.com/AkaruiDevelopment/aoi.js/blob/v6/.github/CONTRIBUTING.md)
