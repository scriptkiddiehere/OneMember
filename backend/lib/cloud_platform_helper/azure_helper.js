const BaseCloudHelper = require('./base_cloud');
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const CronJob = require('../../lib/cron_helper/cron_handler')
const { DefaultAzureCredential } = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
// const { ResourceManagementClient } = require("@azure/arm-resources");
// const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");


const credentials = new DefaultAzureCredential();
const subscriptionId = global.CONFIG.get("azure.subscriptionId");

// Azure services
// const resourceClient = new ResourceManagementClient(credentials, subscriptionId);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
// const storageClient = new StorageManagementClient(credentials, subscriptionId);
const networkClient = new NetworkManagementClient(credentials, subscriptionId);


class AzureHelper extends BaseCloudHelper {


    static isLaunchInProcess = false;
    static isTerminationInProcess = false;
    //launch new instance
    static async launchNewInstance() {
        // return;
        // console.log(await AzureHelper.findVMImage())
        // return;
        if (AzureHelper.isLaunchInProcess) {
            return;
        }
        try {
            AzureHelper.isLaunchInProcess = true;

            const publicIpName = Utility.generateRandomId("rtmppip", {})
            const networkInterfaceName = Utility.generateRandomId("rtmpnic", {})
            // const vnet = await AzureHelper.getVnet()
            const subnetInfo = await AzureHelper.getSubnetInfo()
            const publicIPInfo = await AzureHelper.createPublicIP(publicIpName)
            const nicInfo = await AzureHelper.createNIC(subnetInfo, publicIPInfo, publicIpName, networkInterfaceName)
            const nicResult = await AzureHelper.getNICInfo(networkInterfaceName)
            await AzureHelper.createVirtualMachine(nicResult.id)
            // const vmImageInfo = await findVMImage();
        }
        catch (err) {
            console.error(err);
        }
        AzureHelper.isLaunchInProcess = false;


    }

    static async getSubnetInfo() {
        return await networkClient.subnets.get(global.CONFIG.get("azure.resourceGroupName"), global.CONFIG.get("azure.virtualNetworks")
            , global.CONFIG.get("azure.subnets"));
    }


    static async createPublicIP(publicIpName) {
        const publicIPParameters = {
            location: global.CONFIG.get("azure.region"),
            publicIPAllocationMethod: 'Dynamic',
            // dnsSettings: {
            //     domainNameLabel: domainNameLabel
            // }
        };
        console.log('\n4.Creating public IP: ' + publicIpName);
        return await networkClient.publicIPAddresses.createOrUpdate(global.CONFIG.get("azure.resourceGroupName"), publicIpName, publicIPParameters);
    }

    static async createNIC(subnetInfo, publicIPInfo, publicIpName, networkInterfaceName) {
        const nicParameters = {
            location: global.CONFIG.get("azure.region"),
            ipConfigurations: [
                {
                    name: publicIpName,
                    privateIPAllocationMethod: 'Dynamic',
                    subnet: subnetInfo,
                    publicIPAddress: publicIPInfo,
                    networkSecurityGroup: {
                        "id": "/subscriptions/" + subscriptionId + "/resourceGroups/" + global.CONFIG.get("azure.securityGroup") + "/providers/Microsoft.Network/networkSecurityGroups/" + global.CONFIG.get("azure.securityGroup")
                    }
                }
            ]
        };

        return await networkClient.networkInterfaces.createOrUpdate(global.CONFIG.get("azure.resourceGroupName"), networkInterfaceName, nicParameters);

    }

    static async getNICInfo(networkInterfaceName) {
        return await networkClient.networkInterfaces.get(global.CONFIG.get("azure.resourceGroupName"), networkInterfaceName);
    }


    static async createVirtualMachine(nicId) {

        const vmName = Utility.generateRandomId("rtmpvm", {})
        const vmParameters = {
            location: global.CONFIG.get("azure.region"),
            osProfile: {
                computerName: vmName,
                adminUsername: "ubuntu",
                adminPassword: "Hhands@12345"
            },
            hardwareProfile: {
                vmSize: global.CONFIG.get("azure.vmSize")
            },
            storageProfile: {
                imageReference: {
                    "id": "/subscriptions/" + subscriptionId + "/resourceGroups/" + global.CONFIG.get("azure.resourceGroupName") + "/providers/Microsoft.Compute/images/" + global.CONFIG.get("azure.imageName")
                },
                osDisk: {
                    name: Utility.generateRandomId("rtmpdisk", {}),
                    caching: 'ReadWrite',
                    createOption: 'FromImage',
                    "managedDisk": {
                        "storageAccountType": "Premium_LRS"
                    },
                    deleteOption : "Delete"
                    
                },
            },
            networkProfile: {
                networkInterfaces: [
                    {
                        id: nicId,
                        primary: true
                    }
                ]
            }
        };
        console.log('6.Creating Virtual Machine: ' + vmName);
        console.log(vmParameters);
        console.log(await computeClient.virtualMachines.createOrUpdate(global.CONFIG.get("azure.resourceGroupName"), vmName, vmParameters))
    }


    //Terminate the virtual machine
    static async teminateInstance(globalIpAddress) {
        // return;
        if (AzureHelper.isTerminationInProcess) {
            return;
        }
        console.log("teminateInstance ", globalIpAddress);
        var ipaddressArr = globalIpAddress.split(':')
        var ipAddress = globalIpAddress
        if (ipaddressArr.length > 0) {
            ipAddress = ipaddressArr[0]
        }
        try {
            AzureHelper.isTerminationInProcess = true;

            

            const allIpAddresses = await networkClient.publicIPAddresses.list(global.CONFIG.get("azure.resourceGroupName"))
            var publicIPAddresses = null;
            for (let eachIpAddress of allIpAddresses) {
                if (eachIpAddress.ipAddress === ipAddress) {
                    // console.log(eachIpAddress);
                    publicIPAddresses = eachIpAddress;
                    break;
                }
            }
            console.log("Ip")
            console.log(publicIPAddresses);
            var networkInterface = null;

            if (publicIPAddresses !== null && publicIPAddresses.name) {
                const allNetworkInterfaces = await networkClient.networkInterfaces.list(global.CONFIG.get("azure.resourceGroupName"))
                for (let eachNetworkInterface of allNetworkInterfaces) {
                    if (eachNetworkInterface.ipConfigurations) {
                        for (let ipConfiguration of eachNetworkInterface.ipConfigurations) {
                            if (ipConfiguration && ipConfiguration.name && ipConfiguration.name === publicIPAddresses.name) {
                                // console.log(eachNetworkInterface);
                                networkInterface = eachNetworkInterface;
                                break;
                            }
                        }
                        if (networkInterface !== null) {
                            break;
                        }
                    }
                }
            }

            console.log("networkInterface")
            console.log(networkInterface);
            var virtualMachine = null;
            if (networkInterface !== null && networkInterface.name && networkInterface.virtualMachine && networkInterface.virtualMachine.id) {

                const allVirtualMachines = await computeClient.virtualMachines.list(global.CONFIG.get("azure.resourceGroupName"))
                for (const eachVirtualMachine of allVirtualMachines) {
                    if (eachVirtualMachine && eachVirtualMachine.name && networkInterface.virtualMachine.id.endsWith(eachVirtualMachine.name)) {
                        virtualMachine = eachVirtualMachine;
                        // console.log(virtualMachine);

                    }
                }

            }
            console.log("virtualMachine")
            console.log(virtualMachine);

            if (virtualMachine !== null && virtualMachine.name) {
                console.log(virtualMachine.name + " Terminating");

                await computeClient.virtualMachines.deleteMethod(global.CONFIG.get("azure.resourceGroupName"), virtualMachine.name)
                console.log(virtualMachine.name + " Terminated");
            }
            if (networkInterface !== null && networkInterface.name) {
                console.log(networkInterface.name + " Terminating");

                await networkClient.networkInterfaces.deleteMethod(global.CONFIG.get("azure.resourceGroupName"), networkInterface.name)
                console.log(networkInterface.name + " Terminated");

            }
            if (publicIPAddresses !== null && publicIPAddresses.name) {
                console.log(publicIPAddresses.name + " Terminating");

                await networkClient.publicIPAddresses.deleteMethod(global.CONFIG.get("azure.resourceGroupName"), publicIPAddresses.name)
                console.log(publicIPAddresses.name + " Terminated");

            }
            database.deleteStandBySystem(globalIpAddress)
            database.deleteInUseServer(globalIpAddress)
            database.getAllStandByServer()
            database.getAllInUseServer()
        }
        catch (error) {
            console.error(error)
        }
        AzureHelper.isTerminationInProcess = false;

        // const parmas = {
        //     Filters: [
        //         {
        //             Name: "ip-address",
        //             Values: [ipAddress]
        //         }
        //     ]
        // }
        // ec2.describeInstances(parmas, (err, data) => {
        //     if (err) {
        //         console.log(err, err.stack)
        //         database.deleteStandBySystem(globalIpAddress)
        //     }
        //     else {
        //         console.log("data  ", data);

        //         if (data && data.Reservations && data.Reservations.length > 0 && data.Reservations[0].Instances && data.Reservations[0].Instances.length > 0) {

        //             const instanceId = data.Reservations[0].Instances[0].InstanceId;
        //             console.log("teminateInstance instanceId ", instanceId);

        //             const instanceParams = {
        //                 InstanceIds: [instanceId],

        //             };
        //             ec2.terminateInstances(instanceParams, (err, data) => {
        //                 if (err) { console.log(err, err.stack) }
        //                 else {
        //                     database.deleteStandBySystem(globalIpAddress)
        //                     CronJob.auditSystems()
        //                 }

        //             })

        //         }
        //         else {
        //             console.log("teminateInstance instanceId else ", globalIpAddress);

        //             database.deleteStandBySystem(globalIpAddress)

        //         }

        //     }
        // });

    }
}

module.exports = AzureHelper