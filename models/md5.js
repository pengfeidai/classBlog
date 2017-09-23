/*
* md5加密函数
*/
var crypto = require('crypto');

module.exports = function md5 (code) {
    var md5 = crypto.createHash('md5');
    var pwd = md5.update(code).digest('base64');
    return pwd;
}