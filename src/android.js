const { spawn } = require('child_process');
const config = require('./config');
const Log = require('./log');
const generateApk = () =>
    new Promise((resolve, reject) => {
        const platform = config.getPlatform();
        // 如果并没有配置 android ，那么就不做任何处理
        if (Array.isArray(platform)) {
            if (!platform.includes('android')) {
                resolve();
                return;
            }
        } else {
            if (platform !== 'android') {
                resolve();
                return;
            }
        }
        // 如果没有配置 script ，那么不做任何处理
        const script = config.getScript() || [''];
        if (script?.[0]?.length === 0) {
            resolve();
            return;
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
                Log.success('打包成功');
                resolve();
            }
        });
    });

module.exports = {
    generateApk,
};
