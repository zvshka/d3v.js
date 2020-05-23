

const Guild = require('./Guild');


/**
 * @description Channel base, using for make channels
 * 
 * @private
 */
class Channel {
    constructor(options){
        /**
         * 
         * Client
         * 
         * @type {CLient}
         * 
         * @private
         * 
         */
        this.client = options.client;

        /**
         * Channel type
         * 
         * @type {number} 
         * 
         */
        this.type = options.type || 0;
        /**
         * 
         * Channel position
         * 
         * @type {number}
         * 
         * 
         */
        this.position = options.position;

        /**
         * 
         * Channel topic
         * 
         * @type {String} 
         */
        this.topic = options.topic;

        /**
         * 
         * Category for channel if it exists
         * 
         * @type {number}
         * 
         */
        this.parent_id = options.parent_id;

        /**
         * Is this channel NSFW?
         * 
         * @type {Boolean}
         */
        this.nsfw = options.nsfw;

        /**
         * Channel Guild ID
         * 
         * @type {String}
         * 
         * @private
         */
        this.guildID = options.guildID;

        /**
         * 
         * Channel's guild
         * 
         * @type {Guild} 
         */
        this.guild = null;

        /**
         * 
         * Channel ID
         * 
         * @type {String} 
         */
        this.id = options.id;
    }
}

module.exports = Channel;