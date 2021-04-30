const Execute = require("../handlers/executeEventCommands.js");
class CreateEvent {
  constructor(client, EventEmitter) {
    this.client = client;
    this.event = EventEmitter;
    if (this.event._eventsCount === undefined)
      throw new Error("Data is not an Event Emitter");
    this.commands = [];
  }

  command(...args) {
    for (const d of args) {
      if (!d.name) throw new TypeError(`Event Command needs a name!`);

      if (isNaN(parseInt(d.channel)))
        throw new TypeError("Event Command needs a Snowflake Channel ID");

      if (!d.listen)
        throw new TypeError(
          "Event Command needs a 'listen' to listen to an event"
        );

      if (!d.code) throw new TypeError(`Event Command needs a code!`);

      this.commands.push(d);
    }
  }

  listen(name) {
    if (!name) throw new TypeError("Listener needs a Name to listen");
    const commands = this.commands.filter((f) => f.listen === name);
    this.event.on(name, (...data) => {
      for (const command of commands) {
        Execute(this.client, command, data);
      }
    });
  }
}

module.exports = CreateEvent;
