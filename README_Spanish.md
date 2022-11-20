<p align="center">
  <a href="https://aoi.js.org">
    <img width="300" src="https://cdn.discordapp.com/attachments/804813961190572093/1013150967379808296/aoijs-v6.png" alt="aoijs">
  </a>
</p>

<h1 align="center">aoi.js</h1>

<div align="center">

**El paquete de texto más poderoso para crear simple y rápidamente un bot de Discord.**

[![NPM version][npm-image]][npm-url]
[![AoiJS Server][aoijs-server]][aoijs-server-url]
[![NPM downloads][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/aoi.js.svg?style=flat-square
[npm-url]: http://npmjs.org/package/aoi.js
[download-image]: https://img.shields.io/npm/dt/aoi.js.svg?style=flat-square
[download-url]: https://npmjs.org/package/aoi.js
[aoijs-server]: https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white
[aoijs-server-url]: https://aoi.js.org/invite

[Previsualización](https://aoi.js.org/docs/guides/setup)

[English](README.md) | Español

</div>

## Características

- Incluyendo servicio de una [base de datos](https://www.npmjs.com/package/dbdjs.db) por defecto, listo para diferentes usos.
- Con más de 600 funciones, simples y fáciles de aprender.
- Fácil de usar, basado y compactado en un grupo de lineas de texto.
- Soporte de extensiones para el paquete y el uso de su comunidad.

## Instalación

**Requiere de una versión mayor a la v16.6.0 de Node.js**

```bash
npm install aoi.js
```

```bash
yarn add aoi.js
```

## Cómo usarlo

```javascript
const aoijs = require("aoi.js");

const bot = new aoijs.AoiClient({
    token: "Discord Bot Token",
    prefix: "Discord Bot Prefix", // Ejemplo: ! (!comando)
    intents: ["MessageContent", "Guilds", "GuildsMessages"]
});

// Eventos del bot.
bot.onMessage()

// Ejemplo de comando: ping
bot.command({
    name: "ping",
    code: `Pong! $pingms`
});

// Ejemplo de /comando: /ping
/* HAY QUE USAR LA SIGUIENTE FUNCIÓN PARA CREARLO Y QUE FUNCIONE:
- $createApplicationCommand[$guildID;ping;Descripción;true;slash]
*/
bot.interactionCommand({
    name: "ping",
    prototype: 'slash',
    code: `$interactionReply[Pong! $pingms]`
});
```

### Ejemplo del uso de una función

```php
$authorID - Regresa la ID del usuario que usó el comando.
```

### ¿Cómo funciona?

Es bastante simple, con usar `$` al inicio de una función para que se ejecute, es iniciada al activar un comando.
Con usar `$` al inicio del nombre de una función y sus campos requeridos, (Si es que hay alguno) funcionará según lo que se haya escrito.

## Eventos

Los eventos son un factor importante a la hora de hacer un bot de Discord. Esto ayuda a que todos puedan crear interacciones las cuales ocurran junto con el evento usando aoi.js, un ejemplo sería cuando el bot ha sido iniciado y se ha conectado a Discord usando su API.

```javascript
bot.readyCommand({ // El activador del evento
    channel: "Channel ID", // El canal donde se ejecutará el comando en caso de enviar un mensaje (Opcional)
    code: `Code to execute` // El código que se activará cada que el bot se inicie.
})
```

## Integración: Música

Usa esto bajo la advertencia de que no endosamos ni estamos afiliados a tu bot, solo ayudamos al desarrollo de esta característica.

¿Quieres hacer que tu bot de Discord sea diferente a los otros? Puedes añadir la característica de que este pueda reproducir música o videos en vivo, de manera simple y sencilla.

```php
$playTrack[Tipo (Ejemplo: YouTube);Nombre/URL] - Para reproducir alguna canción de la lista de posibles alternativas (YouTube/Spotify/SoundCloud/Archivo en el Disco)
```
Más información en la [documentación](https://aoi.js.org/docs/advanced-guides/aoimusic/)

### Extenciones opcionales

- [@akarui/aoi.music](https://www.npmjs.com/package/@akarui/aoi.music) para abilitar la funcionabilidad de música. (`npm install @akarui/aoi.music`)
    
## Aviso legal / Descargo de Responsabilidad.
    
aoi.js no está afiliado ni asociado a Discord ni ningún otro servicio mencionado. Esto excluye bots creados con el paquete.
    
## Links
- [Página Web](https://aoi.js.org)
- [NPM](https://www.npmjs.com/package/aoi.js)
- [GitHub](https://github.com/AkaruiDevelopment/aoi.js)
- [Servidor de soporte](https://discord.gg/HMUfMXDQsV)
- [Documentación](https://aoi.js.org/docs/)
