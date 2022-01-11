module.exports = {
  failure: (...error) => {
    let strArr = []
    error.forEach((e) => {
      strArr.push("\033[1;31m" + e)
    })
    console.error(...strArr)
  },
  success: (...info) => {
    let strArr = []
    info.forEach((message) => {
      strArr.push("\032[1;31m" + message)
    })
    console.log(...strArr)
  },
  info: (...info) => {
    console.log(...info)
  },
};