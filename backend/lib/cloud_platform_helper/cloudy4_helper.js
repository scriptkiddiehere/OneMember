const BaseCloudHelper = require('./base_cloud');
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const axios = require('axios')
const CronJob = require('../../lib/cron_helper/cron_handler')

class Cloudy4Helper extends BaseCloudHelper {



    static launchNewInstance() {
        
    }

    static teminateInstance(globalIpAddress) {
        console.log("teminateInstance  Cloudy4 ", globalIpAddress);
        database.deleteStandBySystem(globalIpAddress)
        database.deleteInUseServer(globalIpAddress)
    }
}

module.exports = Cloudy4Helper