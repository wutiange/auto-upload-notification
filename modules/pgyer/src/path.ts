const baseUrl = 'https://www.pgyer.com/apiv2/'


export default {
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
  checkAppIsUpdate: 'app/check', // 检测App是否有更新
  appGroupListAll: 'app/group/listAll', // 列出用户的App分组, 这里说的分组，指的是开发者在「应用管理」-「我的分组」中设置的App分组。
  appGroupView: 'app/group/view', // 查看用户的App分组,这里说的分组，指的是开发者在「应用管理」-「我的分组」中设置的App分组。 这个接口会返回某个App分组的详细信息，同时也返回这个分组里面包含的App信息（只列出最新版本）。
  feedbackListAll: 'app/feedback/listAll', // 查看App反馈信息列表
  feedbackView: 'app/feedback/view', // 查看App反馈信息详情
  crashListAll: 'app/crash/listAll', // 查看应用Crash Log 列表
  crashView: 'app/crash/view', // 查看应用Crash Log 详情
  certificateIndex: 'app/certificate/index', // 查看自己的证书管理
  deleteApp: 'app/deleteApp', // 删除自己的应用
}

export function getUrl(path: string) {
  return `${baseUrl}${path}`
}