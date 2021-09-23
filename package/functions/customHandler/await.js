const Interpreter = require('../../interpreter.js')
const {
    EventEmitter
} = require('events')
class Await extends EventEmitter {
    constructor(msgid, userfilter, customIDs, cmds, errorMsg, uses, client) {
        super();
        this.msgID = msgid
        this.user = userfilter
        this.customIDs = customIDs
        this.cmds = cmds
        this.uses = uses
        this.error = errorMsg
        this.tries = 0
        this.client = client
    }
    async await (msgid, user, customID, data) {
        
        if (this.msgID === msgid && this.user === user && this.customIDs.includes(customID) && this.uses > this.tries) {
            this.emit("AwaitButton", data)
            
            this.tries += 1
        } else if (this.uses <= this.tries) {
            delete this._events.AwaitButton
        }
        
        if (this.user !== user && this.uses > this.tries && this.msgID === msgid) {
            if (this.error.length !== 0) {
                this.client.api.interactions(data.id, data.token).callback.post({
                    data: {
                        type:4,
                        data: {
                            content: typeof this.error[0] === "string" ? this.error[0] : "",
                            embeds: this.error[1] ? (Array.isArray(this.error[1]) ? this.error[1] : [this.error[1]]) : [],
                            flags: this.error[2] === "" ? 0 : this.error[2]
                        }
                    }
                })
            }
        }
    }
    
}

module.exports = Await;
