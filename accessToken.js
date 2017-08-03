'use strict'
const request = require('request');

class Token {
  constructor(ak, sk){
    this.ak = ak;
    this.sk = sk;
    this.authDate = new Date();
    this.token = '';
    this.hasToken = false;
  }

  isExpired() {
    let now = new Date();
    if(now.getTime() - this.authDate.getTime < 36000000){
      return true;
    }
    return false;
  }

  getToken(cb) {
    let option = {
      url : 'https://openapi.baidu.com/oauth/2.0/token',
      method : 'POST',
      form: {
        grant_type: 'client_credentials',
        client_id: this.ak,
        client_secret: this.sk
      }
    }
    request(option, (err, res) => {
      if(err){
        cb(err);
      }else if(res.statusCode === 200){
        let data = JSON.parse(res.body);
        this.token = data.access_token;
        this.hasToken = true;
        cb(null, this.token);
      }else{
        cb(res.statusCode);
      }
    })
  }
}

module.exports = Token;