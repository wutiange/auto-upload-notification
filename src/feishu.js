const { exec } = require('child_process');
const https = require('https');
const { getFeishuMessage, getFeishuMessageTitle } = require('./config');
const { jsonTemplateReplace } = require('./utils');
const uploadFeishuImage = (accessToken, imgFile) => {
    return new Promise((resolve, reject) => {
        exec(
            `curl -# --location --request POST 'https://open.feishu.cn/open-apis/im/v1/images' \
        --header 'Authorization: Bearer ${accessToken}' \
        --header 'Content-Type: multipart/form-data' \
        --form 'image_type="message"' \
        --form 'image=@"${imgFile}"'`,
            (error, stdout, stderr) => {
                const json = JSON.parse(stdout);
                if (json.code === 0) {
                    resolve(json.data.image_key);
                } else {
                    reject(json.msg);
                }
            }
        );
    });
};

const feishuSendMessage = (webhook, data) => {
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                hostname: 'open.feishu.cn',
                path: `/open-apis/bot/v2/hook/${webhook}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(data),
                },
            },
            (res) => {
                res.on('data', (chunk) => {
                    const json = JSON.parse(chunk);
                    if (json.StatusCode !== 0) {
                        reject(json.msg);
                    } else {
                        resolve(json);
                    }
                });
            }
        );

        req.write(data);
        req.end();
    });
};

const handleQRCode = async (phyerInfo = {}, accessToken, imgFile) => {
    const imgKey = await uploadFeishuImage(accessToken, imgFile);
    Object.defineProperty(phyerInfo, 'buildQRCodeURL', {
        get: () => {
            return imgKey;
        },
    });
};

const getMessage = (packageInfo) => {
    const initMessage = getFeishuMessage();
    const preMessage = initMessage.map((msg) => {
        const temp = jsonTemplateReplace(packageInfo, msg);
        if (temp.indexOf('img_') === -1) {
            return [
                {
                    tag: 'text',
                    text: temp,
                },
            ];
        } else {
            return [
                {
                    tag: 'img',
                    image_key: temp,
                    width: 300,
                    height: 300,
                },
            ];
        }
    });
    return JSON.stringify({
        content: JSON.stringify({
            post: {
                zh_cn: {
                    title: getFeishuMessageTitle() || '应用更新',
                    content: preMessage,
                },
            },
        }),
        msg_type: 'post',
    });
};

const getTenantAccessToken = (appId, appSecret) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            app_id: appId,
            app_secret: appSecret,
        });
        const req = https.request(
            {
                method: 'POST',
                hostname: 'open.feishu.cn',
                path: '/open-apis/auth/v3/tenant_access_token/internal',
                headers: {
                    'Content-Type': '"application/json; charset=utf-8"',
                    'Content-Length': Buffer.byteLength(data),
                },
            },
            (res) => {
                if (res.statusCode !== 200) {
                    reject(res.statusMessage);
                }
                res.on('data', (result) => {
                    const json = JSON.parse(result);
                    if (json.code === 0) {
                        resolve(json.tenant_access_token);
                    } else {
                        reject(json.msg);
                    }
                });
            }
        );

        req.write(data);
        req.end();
    });
};

module.exports = {
    handleQRCode,
    feishuSendMessage,
    uploadFeishuImage,
    getMessage,
    getTenantAccessToken,
};
