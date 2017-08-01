/**
 * WechatController
 *
 * @description :: Server-side logic for managing wechats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
const parseString = require('xml2js').parseString;
module.exports = {
	wechat : (req, res) => {
    let query = req.query;
    let token = sails.config.wechatToken;
    let result = sails.services.wechatserver.checkSignature(query, token);
    if(result){
      res.ok(req.query.echostr);
    }else{
      res.status(403).json({error: 'Invalid'});
    }
  },

  wechatRecieve : (req, res, next) => {
    let data = req.rawBody;
    if(!data) return res.badRequest();
    parseString(data, {trim: true, explicitArray: false}, (err, result) => {
      if(err) {
        sails.log.error(err);
        return res.serverError(err);
      }
      let body = result.xml;
      switch(body.MsgType){
        // case 'event': sails.services.wechatserver.replyEvent(body, res);break;
        case 'text': sails.services.wechatserver.replyMessage(body, res);break;
        case 'voice': sails.services.wechatserver.replyVoiceMessage(body, res);break;
        default:return res.ok('success');
      }
    })
  }
};

