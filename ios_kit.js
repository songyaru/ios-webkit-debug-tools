/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2018/7/24  下午4:37
 * @file
 */

const childProcess = require("child_process");

const getPort = require('get-port');


let iosWebkitDebugProxyProcess;

const fetchPort = require('./fetch_port');
const getClient = async () => {
    if (!iosWebkitDebugProxyProcess) {
        let port = await getPort();
        console.log(`Started IOS detector server at http://localhost:${port}\n`);
        const args = [
            '--no-frontend',
            '-c null:' + port + ',:9222-9322'
        ];

        iosWebkitDebugProxyProcess = await createClient({execPath: getExecPath(), args}).catch(_ => null);
        iosWebkitDebugProxyProcess.port = port;
    }
    if (!iosWebkitDebugProxyProcess) {
        throw new Error('无法启动 ios_webkit_debug_proxy 命令，请确保已安装该命令');
    }
    return iosWebkitDebugProxyProcess;
};


const stop = () => {
    if (iosWebkitDebugProxyProcess) {
        iosWebkitDebugProxyProcess.kill('SIGTERM');
        iosWebkitDebugProxyProcess = null;
    }
};


const createClient = ({execPath, args}) => {
    return new Promise((resolve, reject) => {
        iosWebkitDebugProxyProcess = childProcess.spawn(execPath, args);

        iosWebkitDebugProxyProcess.on('error', e => {
            reject(e);
        });

        iosWebkitDebugProxyProcess.on('close', code => {
            reject('close' + e);
        });


        setTimeout(() => {
            resolve(iosWebkitDebugProxyProcess);
        }, 100);
    });

};

const getExecPath = () => {
    if (process.platform === 'darwin') {
        return 'ios_webkit_debug_proxy';
    } else {
        // todo windows
        return null;
    }
};

const start = () => getClient();


const getDeviceInfo = ({filter = d => d} = {}) => {
    return getClient().then(({port}) => fetchPort({port, filter}));
};

const webviewInfo = async ({filter = d => d} = {}) => {

    let devices = await getDeviceInfo({filter}).then(d => d.json).catch(_ => []);
    let info = [];
    let device;
    for (let i = 0; i < devices.length; i++) {
        device = devices[i];
        let deviceName = device['deviceName'] || '';
        let url = device['url'] || '';
        let port = url.split(':')[1];
        if (port) {
            let webviewInfo = await fetchPort({port});
            info.push({port, deviceName, json: webviewInfo.json})
        }
    }

    if (info.length) {
        return info;
    } else {
        throw new Error('没有找到有效的 ios webview 远程调试信息');
    }

};


module.exports = {getClient, webviewInfo, start, stop};
