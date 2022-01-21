const Log = require('./log');
const pgyer = require('./pgyer');
const android = require('./android');
const config = require('./config');
const feishu = require('./feishu');

(async () => {
    // 对 android 进行打包操作
    await android.generateApk();
    Log.success('android 打包成功');
    // 上传安装包到蒲公英并得到安装包信息
    const packages = await pgyer.platformUpload();
    for (let i = 0; i < packages.length; i ++) {
        const package = packages[i];
        // 看用户是否需要显示二维码
        if (feishu.checkHaveQRCode()) {
            // 下载二维码
            Log.info("开始下载二维码，二维码的下载链接为：", package.buildQRCodeURL);
            await pgyer.downloadQRCode(package.buildQRCodeURL);
            Log.success("二维码下载成功");
            // 上传图片到飞书
            // 首先拿到 app_id app_secret
            Log.info("开始上传二维码到飞书");
            const appId = config.getFeishuAppId();
            const appSecret = config.getFeishuAppSecret();
            const tenantAccessToken = await feishu.getTenantAccessToken(appId, appSecret);
            await feishu.handleQRCode(package, tenantAccessToken, 'QR-code.png');
            Log.success("成功上传二维码到飞书");
        }
        Log.info(`正在处理 ${package?.buildType} 发送到飞书的信息。。。`);
        const message = feishu.getMessage(package);
        await feishu.feishuSendMessage(config.getFeishuWebHook(), message);
        Log.success(`${package?.buildType} 的消息已经成功发送。`);
    }
})();