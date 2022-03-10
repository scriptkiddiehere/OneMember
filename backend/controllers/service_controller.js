const axios = require('axios');
const Utility = require('../config/utilis/utilities');
const dbHandler = require('../model/db_handler')
const BaseCloudHelper = Utility.getCloudVendor()


module.exports.onServerStarted = async function (req, res) {

    console.log(req.body);
    dbHandler.onNewInstanceCreated(req.body)
    res.send({ message: 'updated' });
}


module.exports.onRecordingStarted = async function (req, res) {

    console.log(req.body);
    dbHandler.onRecordingStarted(req.body)
    res.send({ message: 'updated' });
}



module.exports.onRecordingEnded = async function (req, res) {

    console.log(req.body);
    dbHandler.onRecordingEnded(req.body)
    res.send({ message: 'updated' });
}

module.exports.getIpAddressForRecording = async function (req, res) {

    console.log("req ", req.body);
    let ipAddress = await dbHandler.getIpAddressForRecording(req.body)
    console.log(ipAddress);
    if (ipAddress !== null) {
        res.send({ message: 'fetched', ipAddress: ipAddress, status: true });

    }
    else {
        res.send({ message: 'No Free Ip', ipAddress: null, status: false });

    }
}


var startRecordingFunction = module.exports.startRecording = async function (req, res) {

    const keyName = req.body.keyName + "";
    if(req.body.keyName && keyName.length > 0){ 
        req.body.fileName = keyName;
    }
    // console.log(req);
    // console.log("Sachin");
    let ipAddress = await dbHandler.getIpAddressForRecording(req.body)
    if (ipAddress !== null) {
        const url = "http://" + ipAddress + "/api/startRecording"

        axios.post(url, req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            timeout: 30000
        })
            .then(response => {
                res.send({ message: 'Recording Started', ipAddress: ipAddress, status: true });

            })
            .catch(error => {
                console.log(error)

                BaseCloudHelper.teminateInstance(ipAddress)
                // startRecordingFunction(req, res)
                res.send({ message: 'Recording Failed', ipAddress: ipAddress, status: false });

            });


    }
    else {
        res.send({ message: 'No Free Ip', ipAddress: null, status: false });

    }
}


module.exports.stopRecording = async function (req, res) {
    const keyName = req.body.keyName + "";
    if(req.body.keyName && keyName.length > 0){ 
        req.body.fileName = keyName;
    }

    var ipAddress = await dbHandler.getRecordingByFileName(req.body.fileName)


    if(ipAddress == null) {
        res.send({ message: 'Recording Failed', ipAddress: ipAddress, status: false });
        return;
    }


    console.log("stopRecording ", ipAddress.serverIp);
    console.log("stopRecording req.body ", req.body);
    console.log("stopRecording ", ipAddress);

    if (ipAddress && ipAddress !== null) {
        console.log("stopRecording ", ipAddress);
        const url = "http://" + ipAddress.serverIp + "/api/stopRecording"
        const params = { fileName: req.body.fileName }

        axios.post(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            timeout: 30000
        })
            .then(response => {
                console.log(response);
                res.send({ message: 'Recording Stoped', ipAddress: ipAddress, status: true });

            })
            .catch(error => {
                console.log(error)
                res.send({ message: 'Recording Failed', ipAddress: ipAddress, status: false });

            });

    }


}

var startRtmpFunction = module.exports.startRtmp = async function (req, res) {
    const keyName = req.body.keyName + "";
    if(req.body.keyName && keyName.length > 0){ 
        req.body.fileName = keyName;
    }

    let ipAddress = await dbHandler.getIpAddressForRecording(req.body)
    if (ipAddress !== null) {
        const url = "http://" + ipAddress + "/api/startRTMP"
        console.log(url)
        axios.post(url, req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            timeout: 30000
        })
            .then(response => {
                res.send({ message: 'RTMP Started', ipAddress: ipAddress, status: true });

            })
            .catch(error => {
                console.log(error)
                BaseCloudHelper.teminateInstance(ipAddress)
                // startRtmpFunction(req, res)
                res.send({ message: 'Recording Failed', ipAddress: ipAddress, status: false });

            });


    }
    else {
        res.send({ message: 'No Free Ip', ipAddress: null, status: false });

    }
}

module.exports.stopRtmp = async function (req, res) {
    const keyName = req.body.keyName + "";
    if(req.body.keyName && keyName.length > 0){ 
        req.body.fileName = keyName;
    }

    var ipAddress = await dbHandler.getRecordingByFileName(req.body.fileName)
    if(ipAddress == null) {
        res.send({ message: 'RTMP Failed', ipAddress: ipAddress, status: false });
        return;
    }
    console.log("stopRecording ", ipAddress.serverIp);
    console.log("stopRecording req.body ", req.body);
    console.log("stopRecording ", ipAddress);

    if (ipAddress && ipAddress !== null) {
        console.log("stopRecording ", ipAddress);
        const url = "http://" + ipAddress.serverIp + "/api/stopRTMP"
        const params = { keyName: req.body.fileName }

        axios.post(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            timeout: 30000
        })
            .then(response => {
                console.log(response);
                res.send({ message: 'RTMP Stoped', ipAddress: ipAddress, status: true });

            })
            .catch(error => {
                console.log(error)
                res.send({ message: 'RTMP Failed', ipAddress: ipAddress, status: false });

            });

    }


}