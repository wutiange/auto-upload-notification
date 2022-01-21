# 自动化测试环境部署


- 1.0 版本内容

- [x] 支持 android 平台打包，手动配置好运行脚本。
- [x] 支持 android 上传到蒲公英
- [x] 支持 android 通知到对应的测试群
- [x] 支持 iOS 上传到蒲公英
- [x] 支持 iOS 通知到对应的测试群

- 2.0 版本的内容

- [x] 新增配置项目地址，这样在任何地方执行都可以，无需弄到项目下，等待 2.0 完成即可使用（代码完成）
- [ ] 支持发送到钉钉

- 3.0 版本的内容

- [ ] 模块化项目，本项目只包含核心模块，其余用户可以根据第三方插件灵活配置
- [ ] 独立蒲公英模块，飞书模块，钉钉模块
- [ ] 开发微信小程序模块，让微信小程序也能实现自动化测试发布

## （一）怎么使用

1. 将项目 clone 下来：
~~~shell
git clone https://github.com/wutiange/auto-upload-notification.git
或
git clone git@github.com:wutiange/auto-upload-notification.git
~~~
2. 安装 nodejs

如果你已经下载 nodejs 忽略这步，否则你需要先去 nodejs 的官网下载，然后按步骤安装，安装很简单只需要一直下一步即可。
然后打开 clone 下来的目录，执行：
```shell
npm install
或
npm i
```
3. 配置

打开项目下的 `auto.json` 文件，然后参照下面的（二）中的属性说明进行对应更改和配置。

4. 使用

（1）如果你是用于 android 项目
- 在 1.0.0 <= version ，那么需要将项目放到 android 的项目下，然后在 android 项目下的 .gitignore 中忽略这些内容。
- 在 1.0.0 < version < 2.0.0 ，那么只需要将 package.json 文件中的 version 更改成 2.0.0 。
- 在 version >= 2.0.0 不用做任何操作。
（2）ios 需要先将包打完，并且第三步配置好。
然后在 clone 的项目下执行：
```shell
node src/index.js
```
这样就成功了，如果遇到问题，可以先参考下面的常见问题，如果没有，并且自己没办法解决，希望能提 issue 。
## （二）以下是目前版本的相关说明和解释（1.0）

*必须在 android 项目下才能进行打包。ios 需要先打好包*

1. script 属性，android 必须指定执行脚本，也就是 `auto.json` 文件中的 `script` 属性； iOS 由于都是使用工具打包，所以如果仅仅是 ios ，那么就不需要指定。

2. platform 属性（数组），代表的是平台，目前有如下几个值，如果要同时指定多个值，那么这样 `["android", "ios"]` 即可：

    - android 仅支持 android， 其他的会自动屏蔽

    - iOS 仅支持对 ios 的上传

    - all 所有平台都支持，目前也就是 android 和 ios 同时支持

3. pgyer 属性，蒲公英相关的配置：

- upload 属性，这里的配置跟蒲公英官网的上传接口相同，[上传app](https://www.pgyer.com/doc/view/api#uploadApp) ，除了 file 属性，这个属性在这里不用填写，程序会根据 packageDir 属性来自动拿取对应的包，下面说这个属性。其中 `_api_key` 的获取只需要在上传 app 那里点击就能获取[上传App](https://www.pgyer.com/doc/view/api#uploadApp)。

4. packageDir 属性，代表包所对应的文件路径，比如 `app/build/outputs/apk/` ，程序会通过指定的路径寻找文件，如果指定的路径下面还有文件夹会递归查找，**然后选出创建时间最近的那一个安装包**。

5. feishu 属性，这个属性是配置跟飞书相关配置的属性，它下面的属性有：

- title 属性，代表发送以后的标题。

- message 属性（数组），代表发送消息的格式，也就是支持自定义消息格式，程序采用的是飞书的富文本，支持显示的app相关属性是上传之后返回的，格式如下：

```json
{
    "buildKey": "Build Key是唯一标识应用的索引ID",
    "buildType": "应用类型（1:iOS; 2:Android）",
    "buildIsFirst": "是否是第一个App（1:是; 2:否）",
    "buildIsLastest": "是否是最新版（1:是; 2:否）",
    "buildFileName": "应用名称",
    "buildFileSize": "App 文件大小",
    "buildName": "应用名称",
    "buildVersion": "版本号, 默认为1.0 (是应用向用户宣传时候用到的标识，例如：1.1、8.2.1等。)",
    "buildVersionNo": "上传包的版本编号，默认为1 (即编译的版本号，一般来说，编译一次会变动一次这个版本号, 在 Android 上叫 Version Code。对于 iOS 来说，是字符串类型；对于 Android 来说是一个整数。例如：1001，28等。)",
    "buildBuildVersion": "蒲公英生成的用于区分历史版本的build号",
    "buildIdentifier": "应用程序包名，iOS为BundleId，Android为包名",
    "buildIcon": "应用的Icon图标key，访问地址为 https://www.pgyer.com/image/view/app_icons/[应用的Icon图标key]",
    "buildDescription": "应用介绍",
    "buildUpdateDescription": "应用更新说明",
    "buildScreenshots": "应用截图的key，获取地址为https://www.pgyer.com/image/view/app_screenshots/[应用截图的key]",
    "buildShortcutUrl": "应用短链接",
    "buildCreated": "应用上传时间",
    "buildUpdated": "应用更新时间",
    "buildQRCodeURL":"应用二维码地址",
}
```

根据上面的，如果我们想要显示应用名称和版本号，那么我们可以使用 `测试应用名称：${name}v${version}` ，这样最后的显示效果为： `测试应用名称：测试v1.0` 。

这个属性的每一个元素代表一行，这里的规则是**去掉 build ，至于后面的首字母既可以大写也可以小写**，如：

```json
[
    "应用名称：${name}",
    "版本号：${version}",
    "应用类型：${type}",
    "更新时间：${updated}",
    "下载二维码：",
    "${QRCodeURL}"
]
```

显示的效果如下：

![image-20220104112500119.png](https://cdn.jsdelivr.net/gh/wutiange/assets@master/images/image-20220104112500119.5da66um3s1c0.webp)

其中二维码只能单独占一行，也就是上面的 `"${QRCodeURL}"`，message 中的二维码只能独占一行，如果想更加自定义消息格式，请使用 customize 属性。

- customize 属性，这个属性的目的是为了那些想自定义消息的同志们，具体格式参考飞书官网中的信息，其中需要把二维码的属性变成 `QRCodeURL` 属性，这样就能拿到二维码，并不支持其他照片，[飞书信息](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/im-v1/message/create_json)。
- webhook 属性，也就是飞书机器人，请参考飞书官网进行添加[自定义机器人指南](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)的操作流程。
- app_id 属性，如果需要显示二维码，那么需要配置这个，在应用中可以查看到。
- app_secret 属性，同上。

由于有时候打包后的名称并不是固定的，所以我采用指定文件夹的方式来进行上传，会自动取文件夹下创建时间最近的那一个文件。

6. projectDir 属性，项目地址 **v2.0.0支持**

只要配置了这个属性，那么就不需要将这个项目放入 android 项目下了，从 1.1.0 就已经包含代码，但是要在 2.0.0 中才能使用。也可以下载下来以后改一下 package.json 中的 version 版本号来实现自动打包上传。


下面是效果图：

![image-20220112153641287.png](https://cdn.jsdelivr.net/gh/wutiange/assets@master/images/image-20220112153641287.3b6s5knpvtk0.webp)


## （三）常见的问题总结

1. 并没有在项目下执行。

```
events.js:292
      throw er; // Unhandled 'error' event
      ^

Error: spawn ./gradlew ENOENT
    at Process.ChildProcess._handle.onexit (internal/child_process.js:269:19)
    at onErrorNT (internal/child_process.js:465:16)
    at processTicksAndRejections (internal/process/task_queues.js:80:21)
Emitted 'error' event on ChildProcess instance at:
    at Process.ChildProcess._handle.onexit (internal/child_process.js:275:12)
    at onErrorNT (internal/child_process.js:465:16)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'spawn ./gradlew',
  path: './gradlew',
  spawnargs: [ 'assemblePreviewRelease', '-Penvironment=perView' ]
}
```

代表找不到 `./gradlew` 脚本，可能是由于执行的地方并不是在项目里面导致的。

2. 扫描总是不是最新的

你可能刚打包上传，结果测试同事扫描后得到的是很久之前的结果，并不是刚才打包的结果；当遇到这种情况下，首先排除一下是不是手机之前扫过其他账号登录的二维码，如果是，那么手机上需要重新登录为最新的账号。



## （四）有疑问的地方请提 issue

