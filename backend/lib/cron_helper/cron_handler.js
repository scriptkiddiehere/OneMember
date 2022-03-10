const { default: axios } = require('axios');
const cron = require('node-cron');
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const BaseCloudHelper = Utility.getCloudVendor()
var isAuditInProgress = false;
module.exports.startCronJob = async function () {

    setTimeout(() => {
        onCronTask()

    }, 5000)
    cron.schedule('*/5 * * * *', () => {
        onCronTask()
    });

    cron.schedule('*/10 * * * *', async () => {
        const standBySystemList = await database.getAllStandByServer()
        var standBySystemIps = Object.keys(standBySystemList)
        checkIfAllSystemsAreUp(standBySystemIps)


        const inUseServerList = await database.getAllInUseServer()
        var inUseServerIps = Object.keys(inUseServerList)
        checkIfAllSystemsAreUp(inUseServerIps)
    });
}


module.exports.auditSystems = async function () {
    onCronTask()
}

async function onCronTask() {
    console.log("onCronTask");
    if (isAuditInProgress) {
        return;
    }

    isAuditInProgress = true;
    const standBySystemList = await database.getAllStandByServer()
    let standBySystemIps = Object.keys(standBySystemList)
    if (global.CONFIG.get('no_of_backup_machine') > standBySystemIps.length) {
        BaseCloudHelper.launchNewInstance()

    }
    else if (global.CONFIG.get('no_of_backup_machine') < standBySystemIps.length) {
        if (standBySystemIps.length > 0) {
            BaseCloudHelper.teminateInstance(standBySystemIps[0])
        }
    }

    isAuditInProgress = false
}

async  function checkIfAllSystemsAreUp(standBySystemIps){
   
    if(!standBySystemIps || standBySystemIps === null || standBySystemIps.length === 0) {
        return;
    }
    const ipAddress = standBySystemIps[0];
    const url = "http://" + ipAddress + "/api/isUp"
    console.log("Chech StandBy Syatme ", ipAddress);
    axios.post(url, {}, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout : 30000
    })
    .then(response => {
        console.log("Chech StandBy Syatme passed ", ipAddress);
        standBySystemIps.splice(0,1)
        checkIfAllSystemsAreUp(standBySystemIps)
    })
    .catch(error => {
        console.log("Chech StandBy Syatme falied ", ipAddress);
        BaseCloudHelper.teminateInstance(ipAddress)

        standBySystemIps.splice(0,1)
        checkIfAllSystemsAreUp(standBySystemIps)
    });
}