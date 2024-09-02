// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    //临时微信用户昵称和头像
    isLogin: false,
    nickName:"未登录",
    src:"/images/index.png",
    //临时收藏夹新闻数据
    newsList:[],
    num:0
  },

  // 获取用户信息
  getMyInfo: function(e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res)
        this.setData({
          isLogin: true,
          src: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
      }
    })
    this.getMyfavorites();
  },
  getMyfavorites: function() {
    const db = wx.cloud.database();
  
    // 查询数据库中的 collect 表单，获取所有收藏的新闻
    db.collection('collect').get({
      success: res => {
        let myList = res.data; // res.data 是包含所有收藏新闻记录的数组
        let num = myList.length;
  
        console.log('收藏列表', myList);
  
        // 更新收藏列表
        this.setData({
          newsList: myList,
          num: num
        });
      },
      fail: err => {
        console.error('获取收藏列表失败', err);
      }
    });
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow:function() {
    //如果已经登录
    if(this.data.isLogin === true){
      console.log("更新列表")
    //更新收藏列表
      this.getMyfavorites()
    }
  },
  /**
   * 
   * 自定义函数--跳转新页面浏览新闻内容
   */
  goToDetail:function(e){
    //获取携带的data-id数据
    let id = e.currentTarget.dataset.id;
    //携带新闻的ID进行页面的跳转
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },

onLoad(options) {
    if(wx.getUserProfile){
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },


 
})