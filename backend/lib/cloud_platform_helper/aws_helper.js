var AWS = require('aws-sdk');
const BaseCloudHelper = require('./base_cloud');
AWS.config.update({ region: global.CONFIG.get("aws.awsRegion") });
var ec2 = new AWS.EC2({ apiVersion: global.CONFIG.get("aws.apiVersion"), accessKeyId: global.CONFIG.get("aws.accessKeyId"), secretAccessKey: global.CONFIG.get("aws.secretAccessKey") });
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const CronJob = require('../../lib/cron_helper/cron_handler')


class AwsHelper extends BaseCloudHelper {


    static isLaunchInProcess = false;
    static launchNewInstance() {
        // return;

        if(AwsHelper.isLaunchInProcess){
            return;
        }
        const instanceParams = {
            ImageId: global.CONFIG.get("aws.imageId"),
            InstanceType: global.CONFIG.get("aws.instanceType"),
            KeyName: global.CONFIG.get("aws.keyName"),
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds : [global.CONFIG.get("aws.securityGroupId")],
            SecurityGroups : [global.CONFIG.get("aws.securityGroupName")],
        };
        AwsHelper.isLaunchInProcess = true;
        ec2.runInstances(instanceParams, function (err, data) {
            setTimeout(()=>{
                AwsHelper.isLaunchInProcess = false; 
            },30000)
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }

    static teminateInstance(globalIpAddress) {
        // return;
        console.log("teminateInstance " , globalIpAddress);
        var ipaddressArr = globalIpAddress.split(':')
        var ipAddress = globalIpAddress
        if(ipaddressArr.length > 0){
            ipAddress  = ipaddressArr[0]
        }
        const parmas = {
            Filters: [
                {
                    Name: "ip-address",
                    Values: [ipAddress]
                }
            ]
        }
        ec2.describeInstances(parmas,  (err, data) =>{
            if (err) {
                 console.log(err, err.stack)
                database.deleteStandBySystem(globalIpAddress)
                database.deleteInUseServer(globalIpAddress)

            }
            else {
                console.log("data  ", data);

                if(data && data.Reservations && data.Reservations.length > 0 && data.Reservations[0].Instances && data.Reservations[0].Instances.length > 0){

                    const instanceId  = data.Reservations[0].Instances[0].InstanceId;
                    console.log("teminateInstance instanceId ", instanceId);

                    const instanceParams = {
                        InstanceIds: [instanceId],
            
                    };
                    ec2.terminateInstances(instanceParams,  (err, data) =>{
                        if (err) { console.log(err, err.stack) }
                        else{
                            database.deleteStandBySystem(globalIpAddress)
                            database.deleteInUseServer(globalIpAddress)
                            CronJob.auditSystems()
                        }

                    })

                }
                else{
                    console.log("teminateInstance instanceId else ", globalIpAddress);

                    database.deleteStandBySystem(globalIpAddress)
                    database.deleteInUseServer(globalIpAddress)


                }

            }
        });
        
    }
}

module.exports = AwsHelper