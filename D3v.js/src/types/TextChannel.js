const Channel = require('./Channel');
const Message = require('./Message');

const axios =  require('axios').default;

/**
 * Text Channel
 * 
 * @extends {Channel}
 */
class TextChannel extends Channel{
    constructor(options){
        super(options)
    }


    /**
     * 
     * Send channel to Message
     * 
     * @param {*} content Message content or Data 
     * @param {*} options Message Options
     */
    async send(content, options = { tts: false }) {
        const data = {
            nonce: 0,
            tts: options.tts ? options.tts : false
        };

        if(typeof content === 'string') data.content = content;
        if(typeof content === 'object') data.embed = content;
        let d = await this.client.sendMessage(this.id, data.content, options, data.embed, this.client);

        return d;
        
        
   
    }

    async fetchMessages(options) {
        if(options.limit > 100 || options.limit < 0) return;
        const body = {};

        if(options['around']) body['around'] = options['around'];
        if(options['before']) body['before'] = options['before'];
        if(options['after']) body['after'] = options['after'];
        if(options['limit']) body['limit'] = options['limit'];
        
        await ApiRequest({ 
            url: `/channels/${this.id}/messages`,
            body: body
        }, this.client.token);
    }

    async bulkDeleteMessages(messages) { // TODO: сделать обработку ошибок
        await ApiRequest({ url: `/channels/${this.id}/messages/bulk-delete`, method: 'POST' }, this.client.token);
        return this;
    }
}

module.exports = TextChannel;