<p align="center">
  <a href="https://aoi.js.org">
    <img width="300" src="https://cdn.discordapp.com/attachments/1058843428831629443/1063251770228342895/aoijsbanner.png" alt="aoijs">
  </a>
</p>

<h1 align="center">aoi.js</h1>

<div align="center">

**The most powerful string package to create a simple and fast Discord Bot.**

[![NPM version][npm-image]][npm-url]
[![AoiJS Server][aoijs-server]][aoijs-server-url]
[![NPM downloads][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/aoi.js.svg
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite

[View Documentation](https://aoi.js.org/docs/)

</div>

## Features

- **Command handler:** Define and manage commands for your bot using the `LoadCommands` method. Modify or add new functionality easily.
- **Utility functions:** Save time and effort with ready-made solutions for common tasks such as sending messages and checking user permissions.
- **Interactive commands:** Allow users to interact with your bot using a special syntax in their messages. Flexible and natural interaction.
- **Custom event handlers:** Customize the behavior of your bot in response to different events, such as message updates and user joins.

## Installation

**node.js 16.9.0 or newer is required.**

```bash
npm install aoi.js
yarn add aoi.js
```

## Setup

```javascript
const aoijs = require("aoi.js")

const bot = new aoijs.AoiClient({
token: "Discord Bot Token",
prefix: "Discord Bot Prefix",
intents: ["MessageContent", "Guilds", "GuildMessages"]
})

//Events
bot.onMessage()

//Command Example (ping)
bot.command({
name: "ping",
code: `Pong! $pingms`
})
```

### Function usage Example

```php
$authorID - Return the author ID/the userID who executed the function
```

### How does it work?

aoi.js uses the `$` symbol as a way to execute functions. To use a function, simply type `$` followed by the function name and any additional fields (if required).

## Events

Events are an important part of creating Discord bots. aoi.js includes several events that allow you to customize the behavior of your bot in response to different situations.

For example, you can use the `readyCommand` event to specify what should happen when the bot is ready and logged onto the API:

```javascript
bot.readyCommand({ //Event Command
    channel: "Channel ID", //The channel where the Client will log. (optional)
    code: `Code to execute` //This can be a message or code to execute.
})
```

## Music Integration

Use this on your precaution, we do not endorse anything or affiliated with, we only add support towards it.

Do you want to make your Discord Bot different from others, possibly with the ability to play/stream music, it's simple and easy to use!

```php
$playTrack[type;name] - To play a track from the available third parties supported. 
```
More information in our [documentation](https://aoi.js.org/docs/advanced-guides/aoimusic/)

### Optional Extensions

- [@akarui/aoi.music](https://www.npmjs.com/package/@akarui/aoi.music) to enable Music Functions compatibility. (`npm install @akarui/aoi.music`)

## Links
- [Website](https://aoi.js.org)
- [NPM](https://www.npmjs.com/package/aoi.js)
- [Github](https://github.com/AkaruiDevelopment/aoi.js)
- [Discord Support Server](https://discord.gg/HMUfMXDQsV)
- [Documentation](https://aoi.js.org/docs/)
