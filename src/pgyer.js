const https = require('https');
const fs = require('fs');
const cliProgress = require('cli-progress');
const FormData = require('form-data');
const Log = require('./log');
const { getInstallationPackage, getBestFormatProgress } = require('./utils');
const { getPgyerUploadInfo, getPlatform } = require('./config');

const pgyerUpload = (platform) => {
    return new Promise((resolve, reject) => {
        // 初始化进度条
        const bar = new cliProgress.SingleBar({
            format: `${platform} 平台的上传进度 {bar} {percentage}% {value}/{total} 上传速度为：{speed} 预计完成时间：{eta_formatted}`,
        }, cliProgress.Presets.shades_classic);
        // 得到上传信息
        const uploadInfo = getPgyerUploadInfo();
        const form = new FormData();
        Object.entries(uploadInfo).forEach(([key, value]) => {
            form.append(key, value);
        });
        const path = getInstallationPackage()[platform];
        // 获取文件的总大小
        const fileTotalSize = fs.statSync(path).size;
        // 初始化进度条显示
        bar.start(fileTotalSize, 0, {speed: "N/A"});
        form.append(
            'file',
            fs.createReadStream(path)
        );
        const request = https.request({
            hostname: 'www.pgyer.com',
            path: '/apiv2/app/upload',
            method: 'POST',
            headers: form.getHeaders(),
        });
        form.pipe(request);

        // 保存进度条数
        let progressLength = 0;
        // 记录上一次时间的毫秒数
        let lastTime = Date.now();
        // 记录上一次的速度
        let lastSpeed = [0, 'k/s'];
        // 保存大概 1s 的进度
        let progressCount = 0;
        form.on("data", (chunk) => {
            // 当前进度
            progressCount += chunk.length;
            // 更新进度
            progressLength += chunk.length;
        });

        const timer = setInterval(() => {
            // 记录当前的时间
            const currentTime = Date.now();
            // 记录时间差
            const experiencedTime = currentTime - lastTime;
            // 得到当前的速度 byte/s
            const speed = progressCount / (experiencedTime / 1000);
            // 根据得到的速度转换成正常的显示
            const properSpeed = !isFinite(speed) ? lastSpeed : getBestFormatProgress(speed);
            // 将当前时间保存为上一次的时间
            lastTime = currentTime;
            // 更新上传进度条
            bar.update(progressLength, {speed: `${properSpeed[0].toFixed(2)} ${properSpeed[1]}`});
            progressCount = 0;
        }, 500)

        form.once("end", () => {
            bar.stop();
            clearInterval(timer);
            Log.success(`${platform} 平台的安装包上传完毕`);
        });

        request.once('response', (res) => {
            if (res.statusCode !== 200) {
                reject(res.statusMessage);
            }
            let str = '';
            res.on('data', (data) => {
                str += data;
            });
            res.once('end', () => {
                const json = JSON.parse(str);
                if (json.code === 0) {
                    json.data.buildType = platform;
                    resolve(json.data);
                } else {
                    reject(json.message);
                }
            });
            res.once('error', (err) => {
                reject(err);
            });
        });
    });
};

// 根据平台上传
const platformUpload = async () => {
    // 得到所有的平台信息
    const platforms = getPlatform();
    // 用于保存安装包路径
    const packageInfos = [];
    if (Array.isArray(platforms)) {
        for (let i = 0; i < platforms.length; i++) {
            packageInfos.push(await pgyerUpload(platforms[i]));
        }
    } else {
        packageInfos.push(await pgyerUpload(platforms));
    }
    return packageInfos;
};

module.exports = {
    pgyerUpload,
    platformUpload,
};
