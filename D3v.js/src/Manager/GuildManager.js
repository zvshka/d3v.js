const Manager = require('./BaseManager');

const APIRequest = require('../types/ApiRequest');

const Guild = require('../types/Guild')

class GuildManager extends Manager {
    constructor(options){
        super({
            type: 'GuildManager'
        })
        this.client = options.client;
    
    }

    /**
     * 
     * @description get Guild by ID from cache
     * 
     * @param {String} id Guild ID 
     */
    get(id){
        return this.cache.get(id)
    }


    async requestUsers(guild){

        this.client.sendJson({op: 8, d: {guild_id: guild.id, query: '', limit: 0}});
    }

    async loadGuild(guilddata){
        if(guilddata.unavailable) return;


        guilddata.members.forEach(e => {
            this.client.users.loadUser(e.user)
        })
        

        
        this.cache.set(guilddata.id, new Guild(guilddata));
    }
    async loadGuilds(guild){
        await this.loadGuild(guild)
    }
}

module.exports = GuildManager;