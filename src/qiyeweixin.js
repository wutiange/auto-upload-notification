const https = require('https');
const { getQyweixinMessage, getCustomizeMessage, getQyweixinMessageTitle } = require('./config');
const { jsonTemplateReplace } = require('./utils');

const qiyeweixinSendMessage = (webhook, data) => {
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                hostname: 'qyapi.weixin.qq.com',
                path: '/cgi-bin/webhook/send?key=' + webhook,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(data),
                },
            },
            (res) => {
                let result = '';
                res.on('data', (chunk) => {
                    result += chunk;
                });
                res.on('end', () => {
                    console.log(result.toString());
                });
            }
        );
        req.write(data);
        req.end();
    });
};

const getMessage = (packageInfo) => {
    // 看看有没有配置 customize 属性，配置了优先这个属性
    const customizeMessage = getCustomizeMessage() || '';
    if (customizeMessage.length > 0) {
        return jsonTemplateReplace(packageInfo, customizeMessage);
    }
    // 拿到用户自定义的信息
    const initMessage = getQyweixinMessage();
    let preMessage = ""
    let imgUrl = ""
    initMessage.forEach((msg, index) => {
        const temp = jsonTemplateReplace(packageInfo, msg)
        if (msg.indexOf('QRCodeURL') === -1) {
            preMessage += (temp + (index === initMessage.length - 1 ? "" : "\n"))
        } else {
            imgUrl = temp
        }
    });
    return JSON.stringify({
        msgtype: 'news',
        news: {
            articles: [
                {
                    title: getQyweixinMessageTitle(),
                    description: preMessage,
                    ...imgUrl && {
                        picurl: imgUrl,
                    },
                    url: imgUrl || "https://www.pgyer.com/my",
                }
            ],
        },
    })
};

module.exports = {
    qiyeweixinSendMessage,
    getMessage,
};
