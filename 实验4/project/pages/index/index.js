Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoubleSpeed: false,
    src:"",
    id:"",
    list: [{
      id: '1001',
      title: '杨国宜先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4',
     imageUrl:"/images/icons/play.png"
      },
      {
      id: '1002',
      title: '唐成伦先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4',
     imageUrl:"/images/icons/play.png"
      },
      {
      id: '1003',
      title: '倪光明先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4',
     imageUrl:"/images/icons/play.png"
      },
      {
      id: '1004',
      title: '吴仪兴先生口述校史实录',
      videoUrl: 
     'http://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4',
     imageUrl:"/images/icons/play.png"
      },
      {
        id: '1001',
        title: '杨国宜先生口述校史实录',
        videoUrl: 
       'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4',
       imageUrl:"/images/icons/play.png"
        },
        {
          id: '1001',
          title: '杨国宜先生口述校史实录',
          videoUrl: 
         'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4',
         imageUrl:"/images/icons/play.png"
          }
      ],
      danmuTxt:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },

  playVideo:function(e){
    this.videoCtx.stop()
    this.setData({
      src:e.currentTarget.dataset.url,
      id:e.currentTarget.dataset.id
    })
    this.videoCtx.play()
  },

  getDanmu:function(e){
    this.setData({
      danmuTxt:e.detail.value,
    })
  },

  sendDanmu:function(e){
    let text = this.data.danmuTxt;
    const c = this.getRandomColor()
    const danmu = {
      text: text,
      color: c,
      time: new Date().getTime(),
      videoId: this.data.id
    };
    console.log(danmu)
    this.saveDanmu(danmu)
    this.videoCtx.sendDanmu({
      text:text,
      color:c
    })
  },

  getRandomColor:function(){
    let rgb = []
    for(let i = 0;i<3;i++){
      let color = Math.floor(Math.random()*256).toString(16)
      color = color.length == 1?'0' +color: color
      rgb.push(color)
    }
    return '#'+rgb.join('')
  },
    // 处理长按事件
    handleLongPress: function() {
      this.setData({
        isDoubleSpeed: true
      });
      this.videoCtx.playbackRate(2); // 设置二倍速播放
    },
  
    // 处理松开手指事件
    handleTouchEnd: function() {
      if (this.data.isDoubleSpeed) {
        this.setData({
          isDoubleSpeed: false
        });
        this.videoCtx.playbackRate(1); // 恢复正常播放速度
      }
    },

  // 保存弹幕到本地存储
  saveDanmu:function (danmu) {
    console.log("保存一个弹幕")
    let danmuList = wx.getStorageSync('danmuList') || [];
    danmuList.push(danmu);
    wx.setStorageSync('danmuList', danmuList);
  },
  // 读取存储的弹幕
  loadDanmu:function () {
  return wx.getStorageSync('danmuList') || [];
  },
  // 加载并展示本地存储的弹幕
  loadAndDisplayDanmu(videoId) {
    console.log(videoId)
    const danmuList = wx.getStorageSync('danmuList') || [];
  
      // 过滤出当前视频的弹幕
    const filteredDanmuList = danmuList.filter(danmu => danmu.videoId === videoId);
  
    // 将弹幕发送到视频中
    filteredDanmuList.forEach(danmu => {
        this.videoCtx.sendDanmu({
          text: danmu.text,
          color: danmu.color
        });
      });
    },
  
    // 播放视频时触发
    handlePlay:function(e) {
      console.log(e)
      this.loadAndDisplayDanmu(this.data.id);
    }

})