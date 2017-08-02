'use strict'
const request = require('request');
const key = sails.config.tulingKey;
module.exports = {
  send : (userid, info, cb) => {
    let option = {
      url : 'http://www.tuling123.com/openapi/api',
      method : 'POST',
      json : true,
      body : {
        key,
        info,
        userid
      }
    };
    request(option, (err, res) => {
      if(err){
        cb(err)
      }else if(res.statusCode === 200){
        cb(null, res.body);
      }else{
        cb(res.statusCode);
      }
    })
  }
}