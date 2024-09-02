// pages/detail/detail.js
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
    /**
   * 页面的初始数据
   */
  data: {
    artical:{
    id: '264698',
    title: '标题',
    poster: 'https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/newsimage1.jpg',
    content: '  内容',
    add_date: '2022-08-19'
    },
    isAdd:false
},


  onLoad(options) {
    let id = options.id
    //检查当前新闻是否在收藏夹中
    var newartical = wx.getStorageSync(id)
    //存在
    if(newartical != '')
    {
      this.setData({
        isAdd:true,
        artical:newartical
      })
    }
    //不存在
    else{
      common.getNewsDetail(id).then(result => {
        console.log(result);
        if (result.code == '200') {
          this.setData({
            artical: result.news,
            isAdd: false
          });
        }
      }).catch(err => {
        console.error('获取新闻详情失败', err);
      });
    }
  },
  /*添加收藏*/
  addFavorites:function () {
    let artical = this.data.artical
    wx.setStorageSync(artical.id, artical)    //将文章放入缓存区
    console.log("加入缓存",artical)
      // 将文章保存到数据库的 collect 表单中
    const db = wx.cloud.database();
  
    db.collection('collect').add({
      data: artical, // 直接将文章对象存入数据库
      success: res => {
        console.log('收藏成功，数据库记录ID:', res.id);
        this.setData({
          isAdd: true
        });
      },
      fail: err => {
        console.error('收藏失败', err);
      }
    });
    this.setData({
      isAdd:true
    })
  },
/* 取消收藏 */
cancelFavorites: function() {
  let artical = this.data.artical;
  
  // 从本地缓存中移除
  wx.removeStorageSync(artical.id);
  
  // 从数据库的 collect 表单中删除
  const db = wx.cloud.database();
  
  // 使用文章 ID 删除记录
  db.collection('collect').where({
    id: artical.id
  }).remove({
    success: res => {
      console.log('取消收藏成功', res);
      this.setData({
        isAdd: false
      });
    },
    fail: err => {
      console.error('取消收藏失败', err);
    }
  });
}
})