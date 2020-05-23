const Manager = require('./BaseManager');

const User = require('../types/User');

class UserManager extends Manager {
    constructor(options) {
        super({
            type: 'User'
        });

        this.client = options.client;
    }

    loadUser(userdata){
        if(this.cache.has(userdata.id)) return;
        userdata.client = {token: this.client.token};
        let user = new User(userdata);
        
        this.cache.set(user.id, user);
    }
}


module.exports = UserManager;