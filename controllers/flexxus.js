
const {FlexxusService} = require('_services/flexxus')

// const flexxusService =  new FlexxusService();

class FlexxusController {

    constructor() {}

    static async ping(){
        return await FlexxusService.ping();
    }    

    static async get(path){
        return FlexxusService.get(path);
    }    
}

/**
 * @exports FlexxusController
 */
module.exports = {
    FlexxusController
};
