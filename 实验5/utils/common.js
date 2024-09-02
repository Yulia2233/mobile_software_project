const db = wx.cloud.database().collection('news');

//获取新闻列表
function getNewsList() {
  return new Promise((resolve, reject) => {
    // 获取数据库实例
    const db = wx.cloud.database();
    
    // 查询数据库中的新闻数据
    db.collection('news').get({
      success: function(res) {
        // 初始化一个空列表用于存储处理后的新闻数据
        let list = [];
        // 遍历从数据库中获取的数据
        for (let i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.id = res.data[i].id;
          obj.poster = res.data[i].poster;
          obj.add_date = res.data[i].add_date;
          obj.title = res.data[i].title;
          list.push(obj);
        }
        console.log(list)
        // 返回处理后的新闻列表
        resolve(list)
      },
      fail: function(err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

//获取新闻内容
function getNewsDetail(newsID) {
  return new Promise((resolve, reject) => {
    const db = wx.cloud.database();

    // 查询数据库中的新闻数据，匹配新闻ID
    db.collection('news').where({
      id: newsID
    }).get({
      success: function(res) {
        if (res.data.length > 0) {
          // 如果找到了匹配的新闻
          let msg = {
            code: '200', // 成功
            news: res.data[0] // 获取到的新闻内容
          };
          resolve(msg);
        } else {
          // 如果没有找到匹配的新闻
          let msg = {
            code: '404', // 没有对应的新闻
            news: {}
          };
          resolve(msg);
        }
      },
      fail: function(err) {
        // 如果数据库查询失败
        console.error('数据库查询失败', err);
        reject(err);
      }
    });
  });
}


// 对外暴露接口
module.exports = {
  getNewsList: getNewsList,
  getNewsDetail: getNewsDetail
}