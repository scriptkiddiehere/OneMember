class Utility{

    static getCloudVendor(){
        if(global.CONFIG.get('cloud_vendor') === "aws"){
            return require("../../lib/cloud_platform_helper/aws_helper")
        }
        else  if(global.CONFIG.get('cloud_vendor') === "do"){
            return require("../../lib/cloud_platform_helper/do_helper")
        }
        else  if(global.CONFIG.get('cloud_vendor') === "azure"){
            return require("../../lib/cloud_platform_helper/azure_helper")
        }
        else  if(global.CONFIG.get('cloud_vendor') === "cloudy4"){
            return require("../../lib/cloud_platform_helper/cloudy4_helper")
        }
    }

    static getDbStorageHandler(){
        if(global.CONFIG.get('preferred_db') === "redis"){
            return require("../../lib/database/redis")
        }
       
    }


    static generateRandomId(prefix, existIds) {
        var newNumber;
        while (true) {
          newNumber = prefix + Math.floor(Math.random() * 10000);
          if (!existIds || !(newNumber in existIds)) {
            break;
          }
        }
        return newNumber;
      }
}


module.exports = Utility;