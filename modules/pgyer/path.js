"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const baseUrl = 'https://www.pgyer.com/apiv2/';
exports.default = {
    getCOSToken: 'app/getCOSToken',
    buildInfo: 'app/buildInfo',
    installApp: 'app/install',
    viewApp: 'app/view',
    updateApp: 'app/update',
    updateAppInfo: 'app/updateApp',
    buildApps: 'app/builds',
    getByShortcut: 'app/getByShortcut',
    listMy: 'app/listMy',
    setNewestVersion: 'app/setNewestVersion',
    cancelNewestVersion: 'app/cancelNewestVersion',
    checkAppIsUpdate: 'app/check',
    appGroupListAll: 'app/group/listAll',
    appGroupView: 'app/group/view',
    feedbackListAll: 'app/feedback/listAll',
    feedbackView: 'app/feedback/view',
    crashListAll: 'app/crash/listAll',
    crashView: 'app/crash/view',
    certificateIndex: 'app/certificate/index',
    deleteApp: 'app/deleteApp', // 删除自己的应用
};
function getUrl(path) {
    return `${baseUrl}${path}`;
}
exports.getUrl = getUrl;
