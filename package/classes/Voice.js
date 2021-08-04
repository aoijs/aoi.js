const voice = require('@discordjs/voice')
const {Collection} = require('discord.js')
const Subscription = require('../Handler/music/subscription.js')
const {EventEmitter} = require('events')
class Voice extends EventEmitter {
    constructor(client,ytOptions={cookie:"YSC=5yaGWYf3sb4; VISITOR_INFO1_LIVE=hRFBhbsmz-U; __Secure-3PSID=8Qc_mMTGhpfQdTm1-fdKq6rh9KNCUC9OONEP44RAQkvVrQrFDkgjRaj6vJdchtNXMrWd4w.; __Secure-3PAPISID=HElVHkUVenb2eFXx/AhvhxMhD_KPsM4nZE; PREF=tz=Asia.Jakarta; __Secure-3PSIDCC=AJi4QfE9ix2TVKVWZzmswEkeDpCcZnuScw9N2pu2dS2fGx1Nyrtv_uDH4vvaiujL82_Ys1OO"},scOptions={
        clientID:""
    },cacheOptions={enabled:false,limit:0}){
        super();
        client.Voice = this 

this.client = client 
        this.voice = client.voice
        this.servers = new Collection()
        this.cacheOptions = cacheOptions 
        Object.defineProperty(this,"ytOptions",{value:ytOptions})
        Object.defineProperty(this,"scOptions",{value:scOptions})
    }
async joinVc(channel,debug=false){
   const con = voice.joinVoiceChannel({channelId:channel.id,guildId: channel.guild.id,debug:debug, adapterCreator: channel.guild.voiceAdapterCreator})
await voice.entersState(con,voice.VoiceConnectionStatus.Ready,10000)
this.servers.set(channel.guild.id,new Subscription(con,this))
    }

}
module.exports = Voice 