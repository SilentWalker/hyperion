'use strict'
const crypto = require('crypto')
const pubsub = sails.config.innerPubsub;
module.exports = {
  checkSignature : (query, token) => {
    let signature = query.signature;
    let timestamp = query.timestamp;
    let nonce = query.nonce;
    let shasum = crypto.createHash('sha1');
    let arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    return shasum.digest('hex') === signature;
  },

  replyMessage : (body, res) => {
    let msgArr = body.content.split(',');
    switch(msgArr[0]){
      case 'pi' :
        //转发给树莓派项目
        pubsub.emit('piMsg', body.content);
      break;
    }
    res.ok();
  },

  replyEvent : (body, res) => {
    //TODO
    res.ok();
  }
}