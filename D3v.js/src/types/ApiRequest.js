const axios = require('axios').default;
const endpoint = 'https://discord.com/api/v6';

/**
 * 
 * @param {Object} options Api request options
 * @param {Client} Client bot client
 * @private
 */
async function ApiRequest(options, client){
        return await axios(`${endpoint}${options.url}`, {
            method: options.method || 'GET',
            data: options.body,
            headers: {
                'Authorization': client.token
            }
        }).then(x => x.data)
}

module.exports = ApiRequest;