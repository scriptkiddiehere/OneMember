const redis = require("redis");
const util = require('util')
var redisClient = null;
var hmgetPromisfy = null;
module.exports.connectDB = async function () {

    console.log(global.CONFIG.get("redis"));
    redisClient = redis.createClient(global.CONFIG.get("redis"));
    redisClient.on('ready', () => {
        console.info('Redis is ready to accept connections.')
    });
    redisClient.on('connect', (data) => {
        console.info('Redis has been connected successfully.', data)
        hmgetPromisfy = util.promisify(redisClient.hgetall).bind(redisClient);

    });
    redisClient.on('end', (err) => {
        console.error('Redis connection has been closed.', err);
    });
    redisClient.on('error', (err) => {
        console.error('Unknown exception occurred at Redis', err);
    });
}
module.exports.deleteStandBySystem = async function(ip){
    deleteRecordingByIpAddressFunc(ip)
    redisClient.hdel("standBySystems",ip)
    
}

function getKeyTimeoutInSeconds() {
    return (100 * 24 * 60 * 60);
}


module.exports.updateStandBySystem = async function(standBySystemObj){

    let jsonStandBySystem = JSON.stringify(standBySystemObj)
    const dictionary = {};
    dictionary[standBySystemObj.ip] = jsonStandBySystem
    redisClient.hmset("standBySystems",dictionary)
    redisClient.expire("standBySystems", getKeyTimeoutInSeconds())

}

module.exports.getAllStandByServer = async function(){
    let standBySystemList = await hmgetPromisfy("standBySystems");
    console.log("standBySystemList ", standBySystemList);
    if(!standBySystemList || standBySystemList === null){
        return {};
    }
    return standBySystemList;
    
}
module.exports.getStandByServerByIp = async function(ip){
    
    let standBySystemList = await hmgetPromisfy("standBySystems");
    if(standBySystemList && standBySystemList !== null){
        for(let ipAddress of Object.keys(standBySystemList)){
            if(ipAddress === ip){
                return JSON.parse(standBySystemList[ipAddress]);
            }
        }
    }
    return null;
    
}
module.exports.getAllInUseServer = async function(){
    let usedSystems = await hmgetPromisfy("usedSystems");
    console.log("getAllInUseServer ", usedSystems);
    if(!usedSystems || usedSystems === null){
        return {};
    }
    return usedSystems;
}
module.exports.updateInUsedSystems = async function(server){
    
    let jsonServer = JSON.stringify(server)
    const dictionary = {};
    dictionary[server.ip] = jsonServer
    redisClient.hmset("usedSystems",dictionary)
    redisClient.expire("usedSystems", getKeyTimeoutInSeconds())

}
module.exports.getUsedServerByIP = async function(ip){
    
    let usedSystems = await hmgetPromisfy("usedSystems");
    if(usedSystems && usedSystems !== null){
        for(let ipAddress of Object.keys(usedSystems)){
            if(ipAddress === ip){
                return JSON.parse(usedSystems[ipAddress]);
            }
        }
    }
    return null;

}


module.exports.deleteInUseServer = async function(ip){

    redisClient.hdel("usedSystems",ip)
    
}

module.exports.updateRecordingsByFileName = async function(recording){
    let jsonServer = JSON.stringify(recording)
    const dictionary = {};
    dictionary[recording.fileName] = jsonServer
    redisClient.hmset("recordings",dictionary)
    redisClient.expire("recordings", getKeyTimeoutInSeconds())

    let standBySystemList = await hmgetPromisfy("recordings");
    console.log("all recordings ", standBySystemList);
 
    
}



module.exports.getRecordingByFileName = async function(fileName){
    
    let recordings = await hmgetPromisfy("recordings");
    // console.log("meetings[meetingId]");
    // console.log(meetings[meetingId]);
    if(recordings && recordings !== null && recordings.hasOwnProperty(fileName)){
        return JSON.parse(recordings[fileName]);
    }
    return null;

}

module.exports.deleteRecording = async function(fileName){

    redisClient.hdel("recordings",fileName)
    
}

const deleteRecordingByIpAddressFunc = module.exports.deleteRecordingByIpAddress = async function(ipAddress){
    let recordings = await hmgetPromisfy("recordings");

    if(recordings !== null){

    console.log(recordings);

    for(let fileName of Object.keys(recordings)){
        if(recordings.hasOwnProperty(fileName)){
            const recording = JSON.parse(recordings[fileName]);
            console.log(recording);
            console.log(recording["serverIp"]);
            if(recording['serverIp'] === ipAddress){
                redisClient.hdel("recordings",fileName)
                break;
            }
        }
    }
    
    let finalRecordings = await hmgetPromisfy("recordings");
    console.log(finalRecordings);

}
    
}