/**
 * 这个文件主要处理配置文件
 */

const config = require('../auto.json');

// 得到 android 的安装包路径
const getAndroidPackageDir = () => {
  return config.packageDir.android;
}
// 得到 ios 的安装包路径
const getIosPackageDir = () => {
  return config.packageDir.ios;
}
// 得到当前的平台是 android ，还是 ios ，或者 all
const getPlatform = () => {
  return config.platform;
}

// 得到 android 的打包脚本
const getScript = () => {
  const script = config.script;
  let scriptArr = [];
  let size = script.length;
  let lastStart = 0;
  for (let i = 0; i < size; i ++) {
    if (script.charAt(i) === ' ') {
      scriptArr.push(script.slice(lastStart, i).trim())
      lastStart = i;
    }
  }
  scriptArr.push(script.slice(lastStart).trim());
  return scriptArr;
}
// 得到上传到蒲公英的配置信息
const getPgyerUploadInfo = () => {
  return config.pgyer.upload
}




// 得到飞书机器人的 webhook
const getFeishuWebHook = () => {
  return config.feishu.webhook
}
// 得到飞书的信息标题
const getFeishuMessageTitle = () => {
  return config.feishu.title
}
// 得到飞书的 app_id
const getFeishuAppId = () => {
  return config.feishu.app_id;
}
// 得到飞书的 app_secret
const getFeishuAppSecret = () => {
  return config.feishu.app_secret;
}
// 得到飞书的信息格式
const getFeishuMessage = () => {
  return config.feishu.message;
}
// 得到自定义信息
const getCustomizeMessage = () => {
  return config.feishu.customize;
}

module.exports = {
  getScript,
  getPgyerUploadInfo,
  getFeishuWebHook,
  getFeishuMessageTitle,
  getFeishuAppId,
  getFeishuAppSecret,
  getFeishuMessage,
  getAndroidPackageDir,
  getIosPackageDir,
  getPlatform,
  getCustomizeMessage
}