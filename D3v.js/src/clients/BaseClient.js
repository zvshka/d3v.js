const WebSocket = require('ws');
const axios = require('axios');
const Enmap = require('enmap');

const {EventEmitter } = require('events');

const Guild = require('../types/Guild');
const Message = require('../types/Message');
const ClientUser = require('../types/ClientUser');
const Role = require('../types/Role');
const GuildManager = require('../Manager/GuildManager')
const GlobalChannelManager = require('../Manager/GlobalChannelManager');
const UserManager = require('../Manager/UserManager');

/**
 * 
 * @description Client base 
 * 
 * @extends {EventEmitter}
 * @private
 */
class BaseClient {
    constructor(options) {
       this.debug = options.debug || false;
       this.events = new EventEmitter();
        this.hb = 0;
        this.user = null;
        this.channels = new GlobalChannelManager({client: this});
        this.users = new UserManager({client: this});
        this.token;

        this.disabledEvents = options.disabledEvents || [];

        this.authOP = {
            "op":2,
            "d": { 
                "token":"",
                "properties": {
                    "os": process.platform,
                    "browser": options.mobile ? "Discord Android" : "Netscape Navigator",
                    "device": "D3v.js"
                },
                "large_threshold": true
            }
        };

        this.enpoint = 'wss://gateway.discord.gg/?v=6&encoding=json';
        this.isReady = false;

        /* Cache managers */
        this.guilds = new GuildManager({ client: this })
        this.channels = new Enmap();
    }


    /**
     * @description register events A.K.A start
     * @private
     */
    async registerEvents() {
        this.ws = new WebSocket(this.enpoint);

        this.ws.on('open', async() => {
            await this.callAuth(this.ws)
        })

        this.ws.on('message', async(data) => {
            data = JSON.parse(data);
            if(data.d) data.d.client = this;
            if(this.disabledEvents.includes(data.t)) return;
            switch (data.t) {
                
                case 'READY':
                    await this.createUserClient()

                    /**
                     * Emit Ready event 
                     * @event Client#Ready
                     * 
                     */

                    this.user = new ClientUser(data.d.user)
                    this.events.emit('ready');
                    this.isReady = true;
                    break;
                case 'CHANNEL_CREATE':

                    break;
                case 'ROLE_CREATE':


                    data.d.client = this;
                    const role = new Role(data.d);
                    this.guilds.get(data.d.guildID).roles.set(data.d.id, role);

                    /**
                     * 
                     * Emits when role was created!
                     * 
                     * @event Client#roleCreate
                     * 
                     * @param {Role} role...
                     */
                    this.events.emit('roleCreate', (role));
                    break;
                case 'GUILD_CREATE':
                    data.d.client = this;


                    this.guilds.loadGuilds(data.d);


                    /**
                     * 
                     * Emits when bot joined guild!
                     * 
                     * @event Client#guildJoin
                     * 
                     * @param {Guild} guild
                     * 
                     */
                    this.events.emit('guildJoin');
                    break;
                case 'MESSAGE_CREATE':
                    let message = new Message(data.d);

                    /**
                     * Emits when message was recieved
                     * 
                     * 
                     * @event Client#Message
                     * 
                     * 
                     * @param {Message} message
                     */
                    this.events.emit('message', (message));
                    break;
                
                default:
                    if(data.op == 11) return;
                    if(!this.isReady){
                        if(!data.d.heartbeat_interval) return;
                        this.hb = data.d.heartbeat_interval;

                        await this.startHeartBeat(this.hb);
                        return;
                        
                    }

                    this.events.emit(`RAW_${data.t}`, data)
                    console.warn(`UNKNOWN EVENT ${data.t}`);
                    
                    break;
            }
            
            //if(this.debug) console.log(data);
        })
    }

    /**
     * 
     * @param {*} interval inverval of heartbeat
     * @private
     */
    async startHeartBeat(interval){
        setInterval(async() => {
            this.sendJson({
                op: 1,
                d: null
            })
        }, interval)
    }


    /**
     * 
     * @description Check is this token valid
     * 
     * @param {String} token Token of user/bot
     * @param {*} bot is this token for user?
     * 
     * @private
     */
    async checkToken(token, bot=true){
        const data = await axios('https://discordapp.com/api/v6/users/@me', {
            method: 'GET', 
            headers: {
                'Authorization': `${bot ? 'Bot ' : ''}${token}`
            }
        }).then(x => x.data).catch(e => {
            throw new InvalidTokenException('Invalid token was provided')
        } );
    }



    /**
     * 
     * @description load current user
     * 
     * @private
     */
    async createUserClient(){
        const data = await axios('https://discordapp.com/api/v6/users/@me', {
            method: 'GET', 
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data);

        this.user = new ClientUser(data);
    }

    /**
     * 
     * @description send JSON data
     * 
     * @param {*} data JSON data
     */

    async sendJson(data){
        await this.ws.send(JSON.stringify(data));
    }

    /**
     * @description send auth json OP
     * 
     * @param {*} socket socket client
     * 
     * @private
     */

    async callAuth(socket){
        socket.send(JSON.stringify(this.authOP))
    }

    /**
     * @description start bot
     */
    async start(){
        await this.registerEvents()
    }

    /**
     * 
     * @param {*} guildid GuildID
     * 
     * @private
     */

    async loadChannels(guildid) {
        const data = await axios(`https://discord.com/api/v6/guilds/${guildid}/channels`, {
            method: 'GET',
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data);

        return data;
    }


    async sendMessage(chid, content, options = {tts: false}, embed = {}){
        let d = await axios(`https://discordapp.com/api/v6/channels/${chid}/messages`, {
            method: 'POST',

            headers: {
                'Authorization': this.token
            }, 

            data: {
                content: content,
                embed: embed,
                nonce: 0,
                tts: options.tts
            }
            
        }).then(x => x.data);
        d.client = this;

        return new Message(d)
    }

    /**
     * 
     * @description Load roles
     * 
     * @param {*} guildid 
     * 
     * @private
     */

    async loadRoles(guildid) {
        const data = await axios(`https://discord.com/api/v6/guilds/${guildid}/roles`, {
            method: 'GET',
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data);

        return data;
    }

    /**
     * 
     * @description load guilds
     * 
     * @private
     * 
     * @deprecated
     */

    async loadGuilds() {
        
    }

    /**
     * 
     * @description login bot in client
     * 
     * @param {*} token  Bot token
     * @param {*} bot is bot?
     */

    async login(token, bot = true) {
        await this.checkToken(token, bot)
        this.token = `${bot ? 'Bot ' : ''}${token}`;
        this.authOP.d.token = `${bot ? 'Bot ' : ''}${token}`
        await this.loadGuilds()
    }

    /**
     * 
     * @description logins and starts bot
     * 
     * @param {*} token Bot token
     * @param {*} bot is bot?
     */

    async run(token, bot = true) {
        
        await this.login(token, bot);
        await this.registerEvents();

    }


  
}



class InvalidTokenException extends Error{};
module.exports = BaseClient;