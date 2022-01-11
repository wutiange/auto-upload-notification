const fs = require('fs');
const path = require('path');
const {
    getInstallationPackage,
    uppercaseFirst,
    jsonTemplateReplace,
} = require('./utils');
const Log = require('./log');
const { handleQRCode, feishuSendMessage, getMessage } = require('./feishu');
const {
    getFeishuWebHook,
    getFeishuMessage,
    getFeishuMessageTitle,
} = require('./config');
const {platformUpload} = require('./pgyer');

// let str = "你好${hello}${world}";
// let regex = /\$\{(\w+)\}/gi;
// Log.info(str.replace(regex, (_, key = "") => {
//   return `\${build${key}}`
// }))

// Log.info(str.match(regex))
const packageInfo = {
    buildKey: 'a4545fd400c3777cd37a010652d96c86',
    buildType: '2',
    buildIsFirst: '0',
    buildIsLastest: '1',
    buildFileKey: '9df36d0d151aa279202d96b9d7e2567c.apk',
    buildFileName: '元气巡店v2.3.7_preview_5eefebf0.apk',
    buildFileSize: '20979993',
    buildName: '元气巡店',
    buildVersion: '2.3.7',
    buildVersionNo: '20307',
    buildBuildVersion: '117',
    buildIdentifier: 'genki.forest.ToureaseAPP',
    buildIcon: '6a91f3c37f647dc76714549638d601cf',
    buildDescription: '',
    buildUpdateDescription: '',
    buildScreenshots: '',
    buildShortcutUrl: 'Tourease-android',
    buildCreated: '2021-12-31 10:37:36',
    buildUpdated: '2021-12-31 10:37:36',
    buildQRCodeURL:
        'https://www.pgyer.com/app/qrcodeHistory/b3762bacb66ff3844eec4cb919c3760dd5b9c7d411e4ab90715551c16b0a2010',
};

(async () => {
    // const packages = await platformUpload();
    // console.log(packages)
    // await handleQRCode(
    //     packageInfo,
    //     't-03073f1c14aabb5d17f99c2c347b655763d3f620',
    //     'QR-code.png'
    // );
    // const message = getMessage(packageInfo);
    // console.log(message)
    // feishuSendMessage(getFeishuWebHook(), message);
})();


const stream = fs.createReadStream("test.txt")
stream.pipe(fs.createWriteStream("test1.txt"))


