'use strict'
const crypto = require('crypto')
module.exports = {
  checkSignature : (query, token) => {
    let signature = query.signature;
    let timestamp = query.timestamp;
    let nonce = query.nonce;
    let shasum = crypto.createHash('sha1');
    let arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    return shasum.digest('hex') === signature;
  }
}