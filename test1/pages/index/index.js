// index.js


Page({
  data:{
    src: '/images/logo.jpg',
    name: 'Hello World',
    isDisabled: false  //按钮可点击
  },
  getProfile: function(e)
  {
    console.log(e.detail.userInfo)
    let info = e.detail.userInfo
    this.setData({
      src: info.avatarUrl,
      name: info.nickName
    })
    const btn = this.selectComponent("#get_info")
    console.log(btn)
    // 禁用按钮
    this.setData({
      isDisabled: true  // 设置按钮为不可点击状态
    });
  }
})
