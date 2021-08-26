// 不能以斜杠结尾
const staffServer = 'http://localhost:3000'

module.exports = {
  '/api': {
    target: staffServer,
  }
}
