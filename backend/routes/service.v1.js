const router = require('express').Router() ? require('express').Router() : {};


const UserController = require('../controllers/users/UserController');
const userController = new UserController()
router.post('/login',userController.login)




// const controller = require("../controllers/service_controller")

// router.post('/onServerStarted', controller.onServerStarted);
// router.post('/onRecordingStarted', controller.onRecordingStarted);
// router.post('/onRecordingEnded', controller.onRecordingEnded);
// router.post('/getIpAddressForRecording', controller.getIpAddressForRecording);


// router.post('/startRecording', controller.startRecording);
// router.post('/stopRecording', controller.stopRecording);

// router.post('/startRtmp', controller.startRtmp);
// router.post('/stopRtmp', controller.stopRtmp);
module.exports = router
