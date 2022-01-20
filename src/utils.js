const fs = require('fs');
const path = require('path');
const {
    getAndroidPackageDir,
    getPlatform,
    getIosPackageDir,
} = require('./config');

// 平台执行器，会根据平台自动执行对应的函数
const platformActuator = ({ android, ios, all }) => {
    const currentPlatform = getPlatform();
    const judge = (platform) => {
        if (platform === 'android' && android) {
            android();
        } else if (platform === 'ios' && ios) {
            ios();
        } else if (platform === 'all' && all) {
            all();
        }
    };
    currentPlatform.forEach((platform) => {
        judge(platform);
    });
};

const getInstallationPackage = () => {
    // 所有的安装包路径地址
    const ip = {};
    // 安装所在位置，android 保存在 key 为 android 的位置； ios 以此类推
    let dir = {};
    platformActuator({
        android: () => (dir.android = getAndroidPackageDir()),
        ios: () => (dir.ios = getIosPackageDir()),
        all: () =>
            (dir = {
                android: getAndroidPackageDir(),
                ios: getIosPackageDir(),
            }),
    });
    const platformDir = Object.entries(dir);
    if (platformDir.length === 0) {
        throw new Error('请至少指定一个平台');
    } else {
        platformDir.forEach(([platform, dir]) => {
            if (!fs.existsSync(dir)) {
                throw new Error(
                    `您所指定的 “${platform}” 平台的路径 “${dir}” 并不存在`
                );
            } else {
                let newTime = -1;
                let platformSuffix = new Set();
                platformActuator({
                    android: () => platformSuffix.add('.apk'),
                    ios: () => platformSuffix.add('.ipa'),
                    all: () => (platformSuffix = new Set(['.apk', '.ipa'])),
                });
                readFilesByDir(dir, (filePath, stat) => {
                    const suffix = path.extname(filePath);
                    if (platformSuffix.has(suffix) && newTime < stat.ctimeMs) {
                        newTime = stat.ctimeMs;
                        ip[platform] = filePath;
                    }
                });
            }
        });
    }
    return ip;
};

/**
 * 从文件夹中查看那些是文件
 * @param {String} dir 文件夹的地址
 * @param {Function} callback 如果是文件的回调
 */
const readFilesByDir = (dir, callback = () => {}) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const newFile = dir + '/' + file;
        const stat = fs.lstatSync(newFile);
        if (stat.isDirectory()) {
            readFilesByDir(newFile, callback);
        } else {
            callback(newFile, stat);
        }
    });
};

/**
 * 将传入字符串首字母大写
 * @param {String} str 需要处理的字符串
 * @returns 处理后的字符串
 */
const uppercaseFirst = (str = '') => {
    if (str.length < 1) {
        throw new Error(
            `您输入的字符串长度必须大于 1 ，而当前的长度为 ${str.length}`
        );
    }
    let tempStr = '';
    for (let i = 0; i < str.length; i++) {
        const chCode = str.charCodeAt(i);
        const ch = str.charAt(i);
        if (
            !((chCode >= 65 && chCode <= 90) || (chCode >= 97 && chCode <= 122))
        ) {
            throw new Error('您传入的字符串并不全是英文字母，请检查');
        }
        if (i === 0) {
            tempStr = ch.toUpperCase();
            continue;
        }
        tempStr += ch;
    }
    return tempStr;
};

const jsonTemplateReplace = (data, jsonOrString = '') => {
    const regex = /\$\{(\w+)\}/gi;
    return jsonOrString.replace(regex, (_, key = '') => {
        return data[`build${uppercaseFirst(key)}`];
    });
};

/**
 * 根据字节大小返回合适的显示方式 [100, 'kb/s']
 * @param {Number} byte 字节大小
 * @returns Array
 */
const getBestFormatProgress = (byte) => {
    const fun = (byte, i, unit) => {
        if (byte < 1000 || i === (unit.length - 1)) {
            return [byte, unit[i]];
        }
        return fun(byte / 1024, i + 1, unit);
    }
    return fun(byte, 0, ['byte/s', 'kb/s', 'mb/s', 'gb/s', 'tb/s', 'pb/s']);
}

const compareVersionNumber = (currentVersion = "", referVersion = "") => {
    const curSplit = currentVersion.split(".").map(v => v - 0);
    const refSplit = referVersion.split(".").map(v => v - 0);
    console.log("curSplit", curSplit);
    console.log("refSplit", refSplit);
    if (curSplit[0] !== refSplit[0]) {
        return curSplit[0] - refSplit[0];
    } else if (curSplit[1] !== refSplit[1]) {
        return curSplit[1] - refSplit[1];
    } else {
        return curSplit[2] - refSplit[2];
    }
}

module.exports = {
    platformActuator,
    getInstallationPackage,
    uppercaseFirst,
    jsonTemplateReplace,
    getBestFormatProgress,
    compareVersionNumber,
};
