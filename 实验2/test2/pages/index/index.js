Page({
  onReady: function () {
  },

   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getId(this.data.region[1])
  },

  drawRain: function () {
    const ctx = wx.createCanvasContext('rainCanvas', this);
    const w = wx.getSystemInfoSync().windowWidth;
    const h = wx.getSystemInfoSync().windowHeight;
    const raindrops = [];
    const numDrops = 100;

    for (let i = 0; i < numDrops; i++) {
      raindrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 3 + 2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.setFillStyle('rgba(174,194,224,0.5)');
      ctx.setStrokeStyle('rgba(174,194,224,0.5)');
      ctx.setLineWidth(2);
      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > h) {
          drop.y = -drop.length;
          drop.x = Math.random() * w;
        }
      });

      ctx.draw();
      requestAnimationFrame(draw);
    };

    draw();
  },

  clearRain: function() {
    const ctx = wx.createCanvasContext('rainCanvas'); // 假设你的 canvas-id 为 'rainCanvas'
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight); // 清空整个画布
    ctx.draw(); // 执行清空操作
    this.setData({ isRaining: false });
  },
  
  /**
   * 页面的初始数据
   */
  data: {
    region:['山东省','青岛市','黄岛区'],
    id: 101220301,
    now: {
      temp: 0,//温度
      text:'未知',//内容
      icon:'999',//天气代码
      humidity: 0,//湿度
      pressure: 0,
      vis: 0,
      windDir: 0,
      windScale: 0,
      windSpeed: 0
    },
    hours: [
        { time: 0, icon: '100', temp: 20 },
        { time: 1, icon: '100', temp: 19 },
        { time: 2, icon: '100', temp: 19 },
        { time: 3, icon: '100', temp: 19 },
        { time: 4, icon: '100', temp: 19 },
        { time: 5, icon: '100', temp: 19 },
        { time: 6, icon: '100', temp: 19 },
        { time: 7, icon: '100', temp: 19 },
        { time: 8, icon: '100', temp: 19 },
        { time: 9, icon: '100', temp: 19 },
        { time: 10, icon: '100', temp: 19 },
        { time: 11, icon: '100', temp: 19 },
        { time: 12, icon: '100', temp: 19 },
        { time: 13, icon: '100', temp: 19 },
        { time: 14, icon: '100', temp: 19 },
        { time: 15, icon: '100', temp: 19 },
        { time: 16, icon: '100', temp: 19 },
        { time: 17, icon: '100', temp: 19 },
        { time: 18, icon: '100', temp: 19 },
        { time: 19, icon: '100', temp: 19 },
        { time: 20, icon: '100', temp: 19 },
        { time: 21, icon: '100', temp: 19 },
        { time: 22, icon: '100', temp: 19 },
        { time: 23, icon: '100', temp: 18 }
      ]
  },

  regionChange: function(e) {
    this.setData({region: e.detail.value})
    this.getId(this.data.region[1])
  },

  getId: function(city) {
    city = city.slice(0, -1)
    let that = this

    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        location: city,
        key: "32481277610c405b9f6cbfa910c2d165"
      },
      success: function(res) {
        that.setData({id: res.data.location[0].id})
        that.getWeather()
        that.getHourly()
      }
    })
  },

  getWeather: function() {
    console.log(this.data.id)
    let that = this
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now',
      data: {
        location: that.data.id,
        key: "32481277610c405b9f6cbfa910c2d165"
      },
      success: function(res) {
        console.log(res.data)
        that.setData({now: res.data.now})
        if(res.data.now.icon>=300&&res.data.now.icon<=470)
        {
          that.drawRain();
        }
        else{
          that.clearRain()
        }
      }
    })
  },

 getHourly:function(){
  let that = this
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/24h',
    data:{
      location:that.data.id,
      key: "32481277610c405b9f6cbfa910c2d165"
    },
    success:function(res){
      console.log(res.data)
      let hourlyData = res.data.hourly.map(item => {
        let st = item.fxTime.slice(11, 13); // 从 fxTime 中提取时间（小时）
        return {
          temp: item.temp,
          time: st,
          icon: item.icon
        };
      });

      // 更新页面数据
      that.setData({
        hours: hourlyData
      });
    }
  })
 }


  
})
