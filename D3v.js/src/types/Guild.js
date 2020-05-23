const axios = require('axios');
const Enmap = require('enmap');
const RoleManager = require('../Manager/RolesManager');
const ChannelManager = require('../Manager/ChannelManager');


class Guild{
    constructor(options){

        this.raw = options;
        this.unavailable = options.unavailable || false;
        this.explicit_content_filter = options.explicit_content_filter;
        
        this.verification_level = options.verification_level || 0;
        this.vanity_url_code = options.vanity_url_code || null;
        this.region = options.region || 'russia';
        this.premium_tier = options.premium_tier || 0;
        this.features = options.features || [];
        this.guild_hashes = options.guild_hashes || [];
        this.banner = options.banner || null;
        this.system_channel_id = options.system_channel_id || 0;
        this.emojis = options.emojis || [];
        this.afk_channel_id = options.afk_channel_id || 0;
        this.public_updates_channel_id = options.public_updates_channel_id || 0;
        this.application_id = options.application_id || 0;
        this.members = options.members || [];
        this.premium_subscription_count = options.premium_subscription_count || 0;
        this.name = options.name || 'Invalid Guild'; 
        this.voice_states = options.voice_states || null;
        this.system_channel_flags = options.system_channel_flags || [];
        
        this.mfa_level = options.mfa_level || 0;
        this.large = options.large || false;
        this.rules_channel_id = options.rules_channel_id || 0;
        this.afk_timeout = options.afk_timeout || 300;
        this.splash = options.splash || '';
        this.discover_splash = options.discover_splash || '';
        this.default_message_notifications = options.default_message_notifications || '';
        this.owner_id = options.owner_id || 0;
        this.preferred_locale = options.preferred_locale || 'ru-RU';
        this.joined_at = options.joined_at || new Date();
        this.presences = options.presences || [];
        this.member_count = options.member_count || 1;
        this.icon = options.icon || '';
        this.description = options.description || '';
        this.id = options.id || 0;
        this.client = options.client || null;
        this.roles = [];
        this.channels = new ChannelManager({guild: this, client: options.client});
        
    }


    async createRole(){
        
    }
}

module.exports = Guild;