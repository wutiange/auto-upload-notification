const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
const { getInstallationPackage } = require('./utils');
const { getPgyerUploadInfo, getPlatform } = require('./config');

// 0b9e7c7b9cf4ace8c41626f6371d2eca
// 88c5b39676526740a60730036df09bfa

const pgyerUpload = (platform) => {
    return new Promise((resolve, reject) => {
        const uploadInfo = getPgyerUploadInfo();
        const form = new FormData();
        Object.entries(uploadInfo).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append(
            'file',
            fs.createReadStream(getInstallationPackage()[platform])
        );
        const request = https.request({
            hostname: 'www.pgyer.com',
            path: '/apiv2/app/upload',
            method: 'POST',
            headers: form.getHeaders(),
        });
        form.pipe(request);

        request.on('response', (res) => {
            if (res.statusCode !== 200) {
                reject(res.statusMessage);
            }
            let str = '';
            res.on('data', (data) => {
                str += data.toString();
            });
            res.on('end', () => {
                const json = JSON.parse(str);
                if (json.code === 0) {
                    resolve(json.data);
                } else {
                    reject(json.message);
                }
            });
            res.on('error', (err) => {
                reject(err);
            });
        });
    });
};

const platformUpload = async () => {
    const platforms = getPlatform();
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
