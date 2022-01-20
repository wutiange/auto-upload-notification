const { spawn } = require('child_process');
const {chdir} = require('process');
const {compareVersionNumber} = require('./utils');
const config = require('./config');
const Log = require('./log');
const generateApk = () =>
    new Promise((resolve, reject) => {
        const platform = config.getPlatform();
        // 如果并没有配置 android ，那么就不做任何处理
        if (!platform.includes('android')) {
            resolve();
            return;
        }
        // 如果没有配置 script ，那么不做任何处理
        const script = config.getScript() || [''];
        if (script?.[0]?.length === 0) {
            resolve();
            return;
        }
        // 先切换到项目下，前提的是 2.0.0 版本以后才支持
        if (compareVersionNumber(config.getVersion(), "2.0.0") >= 0) {
            chdir(config.getAndroidProjectDir());
        }
        const gradlew = spawn(script[0], script.slice(1));
        gradlew.stdout.on('data', (data) => {
            Log.info(data.toString());
        });
        gradlew.stderr.on('data', (data) => {
            Log.failure('stderr', data.toString());
            reject();
        });
        gradlew.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject("关闭的时候出现了错误");
            }
        });
    });

module.exports = {
    generateApk,
};
