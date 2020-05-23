const Enmap = require('enmap');

/**
 * @description manager base
 * 
 * 
 */
class Manager{
    constructor(options){
        this.cache = new Enmap();
    }
}

module.exports = Manager;