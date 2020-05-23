const Manager = require('./BaseManager');
const TextChannel = require('../types/TextChannel');

const ChannelType = {
    0: 'TEXT',
    1: 'DM',
    2: 'VOICE',
    3: 'GROUP_DM',
    4: 'CATEGORY',
    5: 'NEWS',
    6: 'STORE' 
}

class ChannelManager extends Manager{
    constructor(options){
        super({
            type: 'channels'
        });

        this.guild = options.guild;
        this.client = options.client;
  
    }


    async loadChannels(guild, channels){
        guild.raw.channels.forEach(e => {
            if(e.type == 0) this.cache.set(e.id, new TextChannel(e));
            
        })
    }
}



module.exports = ChannelManager;