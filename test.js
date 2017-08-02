'use strict'
const kugou = require('./api/services/kugou.js');
kugou.search('许嵩的静夜思', 1, 5, (err, rs) => {
  if(err){
    console.log(err)
  }else{
    // console.log(rs)
    let hash = rs[0]['320hash'] ? rs[0]['320hash'] : rs[0]['hash'];
    kugou.songInfo(hash, (err, rs) => {
      if(err){
        console.log(err)
      }else{
        console.log(`歌名 : ${rs.fileName}\n时长 : ${parseInt(rs.timeLength / 60)}分${rs.timeLength % 60}秒\nURL  : ${rs.url}`)
      }
    })
  }
})
