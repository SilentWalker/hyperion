'use strict'
const crypto = require('crypto')
const pubsub = sails.config.innerPubsub;
const nodejieba = require('nodejieba');
const WeChatApi = require('wechat-api');
const api = new WeChatApi(sails.config.appId, sails.config.appSecret);
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
    let msgArr = body.Content.split(',');
    switch(msgArr[0]){
      case 'pi' :
        //转发给树莓派项目
        pubsub.emit('piMsg', body.Content);
      break;
      default :
        sails.services.tuling.send(
          body.FromUserName,
          body.Content
        , (err, result) => {
          console.log(result);
          pubsub.emit('piMsg', 'voice|' + result.text);
          //订阅号无法在后台发送客服消息
          // api.sendText(body.FromUserName, result.text + (result.url ? '\n' + result.url : ''), (err, rs) => {
          //   if(err){
          //     sails.log.error(err);
          //   }else{
          //     sails.log.info(rs);
          //   }
          // })
        })
    }
    res.ok();
  },

  replyVoiceMessage : (body, res) => {
    sails.log.debug(body.Recognition);
    let words = nodejieba.cut(body.Recognition);
    let userOpenId = body.FromUserName;
    switch(words[0]){
      case '点歌' : 
        let tmpStr = body.Recognition.slice(2);
        let songName = tmpStr.slice(0, tmpStr.length - 1);
        sails.services.kugou.search(songName, 1, 3, (err, rs) => {
          if(err){
            sails.log.error(err);
          }else{
            let hash = rs[0]['320hash'] ? rs[0]['320hash'] : rs[0]['hash'];
            sails.services.kugou.songInfo(hash, (err, rs) => {
              if(err){
                sails.log.error(err);
              }else{
                sails.log.info(`歌名 : ${rs.fileName}\n时长 : ${parseInt(rs.timeLength / 60)}分${rs.timeLength % 60}秒\nURL  : ${rs.url}`);
                pubsub.emit('piMsg', 'music|' +　rs.url);
                // api.sendText(userOpenId, `歌名 : ${rs.fileName}\n时长 : ${parseInt(rs.timeLength / 60)}分${rs.timeLength % 60}秒\nURL  : ${rs.url}`, (err, rs) => {
                //   if(err){
                //     sails.log.error(err);
                //   }else{
                //     sails.log.info(rs);
                //   }
                // })
              }
            })
          }
        })
      break;
      case '停止' :
        if(words[1] === '播放'){
          pubsub.emit('piMsg', 'stopmusic');
        }
      break;
      default : 
        //转接到图灵机器人
        sails.services.tuling.send(
          body.FromUserName,
          body.Recognition
        , (err, result) => {
          console.log(result);
          pubsub.emit('piMsg', 'voice|' + result.text);
        })
    }
    res.ok();
  },

  replyEvent : (body, res) => {
    //TODO
    res.ok();
  },

  // sendText : (openid, text) => {
  //   return new Promise((resolve, reject) => {
  //     api.sendText(openid, text, (err, result) => {
  //       if(err) reject(err);
  //       resolve(result);
  //     }) 
  //   })
  // }
}