// index.js


Page({
  data:{
    src: '/images/logo.jpg',
    name: 'Hello World'
  },
  getProfile: function(e)
  {
    console.log(e.detail.userInfo)
    let info = e.detail.userInfo
    this.setData({
      src: info.avatarUrl,
      name: info.nickName
    })
  }
})
