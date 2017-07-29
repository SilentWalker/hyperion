/**
 * WechatController
 *
 * @description :: Server-side logic for managing wechats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
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
  }
};

