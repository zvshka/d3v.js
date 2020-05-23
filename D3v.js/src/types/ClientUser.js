const axios = require('axios');
const User = require('./User');


class ClientUser{
    constructor(options){
        this.client = options.client;
        /**
         * Is this user verified?
         * 
         * @type {Boolean}
         */
        this.verified = options.verified || false;

        /**
         * Is 2fa enabled on this account?
         * 
         * @type {boolean}
         * 
         */
        this.mfa_enabled = options.mfa_enabled || false;
        /**
         * ID of current user
         * 
         * @type {String}
         * 
         * 
         */
        this.id = options.id || 0;

        /**
         * User flags
         * 
         * @type {number}
         * 
         */
        this.flags = options.flags || 0;
        /**
         * 
         * Email of current user
         * 
         * @type {String}
         */
        this.email = options.email || 'admin@discord.com';

        /**
         * User discriminator
         * 
         * @type {String}
         */
        this.descriminator = options.descriminator || '0000';

        /**
         * Is this user bot?
         * 
         * @type {Boolean}
         */
        this.bot = options.bot || true;

        /**
         * User avatar ID
         * 
         * @type {String}
         */
        this.avatar = options.avatar || null;

        /**
         * Avatar URL
         * 
         * @type {String}
         */
        this.avatarURL = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`
    }
}

module.exports = ClientUser;