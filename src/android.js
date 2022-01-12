const {spawn} = require('child_process')
const config = require('./config')
const Log = require('./log');
const generateApk = () => new Promise((resolve, reject) => {
  const script = config.getScript() || "";
  if (script.length === 0) {
    return;
  }
  const gradlew = spawn(script[0], script.slice(1));
  gradlew.stdout.on('data', (data) => {
    Log.info(data.toString());
  });
  gradlew.stderr.on('data', (data) => {
    Log.failure('stderr', data.toString());
    reject()
  });
  gradlew.on('close', (code) => {
    if (code === 0) {
      Log.success("打包成功");
      resolve()
    }
  });
})

module.exports = {
  generateApk
}