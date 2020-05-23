const BaseClient = require('./BaseClient');

const axios = require('axios');

const User = require('../types/User');
const Guild = require('../types/Guild');
const TextChannel = require('../types/TextChannel');
const Message = require('../types/Message');
const Role = require('../types/Role');

const ApiRequest = require('../types/ApiRequest')


/**
 * @description Client
 * @public
 * @extends {BaseClient}
 */
class Client extends BaseClient{
    constructor(options){
        super(options)

        
    }

    /**
     * 
     * @param  {String} event name
     * @param  {Function} f Function
     * 
     */
    on(event, f){
        this.events.on(event, f)
    }

    /**
     * 
     * @param  {...any} args emit args
     * 
     * @private
     */
    emit(...args){
        this.events.emit(...args)
    }

    /**
     * 
     * @description Get User by ID
     * 
     * @param {String} userid User ID
     * 
     * @returns {User} user if its exists
     * 
     * 
     */

    async fetchUser(userid) {
        const data = await axios(`https://discordapp.com/api/v6/users/${userid}`, {
            method: 'GET', 
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data);
        
        return new User(data);
    }

    /**
     * 
     * @description Get Guild by id if it exists
     * 
     * @param {String} guildid Guild ID
     * 
     * @returns {Guild} guild
     * 
     */

    async fetchGuild(guildid) {
        const data = await axios(`https://discordapp.com/api/v6/users/${guildid}`, {
            method: 'GET', 
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data).catch(e => console.log('404 lmao'));
        
        return new Guild(data);
    }

    /**
     * 
     * @description Get Channel by ID if it exists
     * 
     * @param {String} channelID 
     * 
     * @returns {Channel} channel
     */

    async fetchChannel(channelID) {
        const data = await axios(`https://discordapp.com/api/v6/channels/${channelID}`, {
            method: 'GET',
            headers: {
                'Authorization': this.token
            }
        }).then(x => x.data);

        data.client = this;
        return new TextChannel(data);
    }

    /**
     * 
     * @param {String} chid Channel ID to send
     * @param {Object} content Message content of object
     * @param {Object} options Message options
     * @param {*} embed Embed if it exists
     */

    async sendMessage(chid, content, options = {tts: false}, embed = {}, token){
        let d = await ApiRequest({url: `/channels/${chid}/messages`, method: 'POST', body: {
            content: content,
            nonce: 0,
            embed: embed,
            tts: options.tts}}, token)
        d.client = this;

        return new Message(d)
    }

    async apiRequest(options){
        return await ApiRequest({url: options.url, method: options.method}, this.token);
    }
}

module.exports = Client;