'use strict'
const Token = require('../../accessToken.js');
let token = new Token(sails.config.aipAk, sails.config.aipSk);
module.exports = {
  speak : (text, cb) => {
    if(token.isExpired() || !token.hasToken){
      token.getToken((err, rs) => {
        if(err){
          return cb(err);
        }else{
          return cb(null, generateUrl(rs, text));
        }
      })
    }else{
      return cb(null, generateUrl(token.token, text));
    }
    function generateUrl(token, text){
      return encodeURI(`http://tsn.baidu.com/text2audio?tex=${text}&lan=zh&tok=${token}&ctp=1&cuid=sw&spd=5&pit=5&vol=6&per=4`);
    }
  }
}