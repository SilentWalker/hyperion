'use strict'
// const kugou = require('./api/services/kugou.js');
// kugou.search('许嵩的静夜思', 1, 5, (err, rs) => {
//   if(err){
//     console.log(err)
//   }else{
//     // console.log(rs)
//     let hash = rs[0]['320hash'] ? rs[0]['320hash'] : rs[0]['hash'];
//     kugou.songInfo(hash, (err, rs) => {
//       if(err){
//         console.log(err)
//       }else{
//         console.log(`歌名 : ${rs.fileName}\n时长 : ${parseInt(rs.timeLength / 60)}分${rs.timeLength % 60}秒\nURL  : ${rs.url}`)
//       }
//     })
//   }
// })
const Token = require('./accessToken.js');
let token = new Token('', '');


if(token.isExpired() || !token.hasToken){
  token.getToken((err, rs) => {
    console.log(generateUrl(rs, '你好呀'))
  })
}else{
  console.log(generateUrl(token.token, '你好呀'))
}
function generateUrl(token, text){
  return encodeURI(`http://tsn.baidu.com/text2audio?tex=${text}&lan=zh&tok=${token}&ctp=1&cuid=sw&spd=5&pit=5&vol=6&per=4`);
}
