const Log = require('./log');
const {platformUpload} = require('./pgyer');
const { generateApk } = require('./android');
const {getFeishuWebHook, getFeishuAppId, getFeishuAppSecret} = require('./config');
const { handleQRCode, feishuSendMessage, getMessage, getTenantAccessToken, checkHaveQRCode } = require('./feishu');

(async () => {
    // 对 android 进行打包操作
    await generateApk();
    // 上传安装包到蒲公英并得到安装包信息
    const packages = await platformUpload();
    for (let i = 0; i < packages.length; i ++) {
        Log.info(`正在处理 ${packages[i]?.buildType} 发送到飞书的信息。。。`);
        // 看用户是否需要显示二维码
        if (checkHaveQRCode()) {
            // 首先拿到 app_id app_secret
            const appId = getFeishuAppId();
            const appSecret = getFeishuAppSecret();
            const tenantAccessToken = await getTenantAccessToken(appId, appSecret);
            await handleQRCode(packages[i], tenantAccessToken, 'QR-code.png');
        }
        const message = getMessage(packages[i]);
        await feishuSendMessage(getFeishuWebHook(), message);
        Log.success(`${packages[i]?.buildType} 的消息已经成功发送。`);
    }
})();