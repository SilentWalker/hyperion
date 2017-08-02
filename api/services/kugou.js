'use strict'
const request = require('request');

module.exports = {
  //根据关键字搜索音乐
  search : (keyword, page, pageSize, cb) => {
    let url = `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${keyword}&page=${page}&pagesize=${pageSize}`;
    request(encodeURI(url), (err, res, body) => {
      if(err){
        console.log(err);
        cb({error : 1, err});
      }else if(!err && res.statusCode === 200){
        let result = JSON.parse(body);
        cb(null, result.data.info)
      }else{
        cb({error : 2, statusCode : res.statusCode})
      }
    })
  },
  //根据音乐Hash获取播放地址
  songInfo : (hash, cb) => {
    let url = `http://m.kugou.com/app/i/getSongInfo.php?hash=${hash}&cmd=playInfo`;
    request(encodeURI(url), (err, res, body) => {
      if(err){
        console.log(err);
        cb({error : 1, err});
      }else if(!err && res.statusCode === 200){
        let result = JSON.parse(body);
        cb(null, result)
      }else{
        cb({error : 2, statusCode : res.statusCode})
      }
    })
  }
}