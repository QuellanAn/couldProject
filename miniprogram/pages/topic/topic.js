const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../index/user-unlogin.png',
    userInfo: {},
    topic_name: '',
    correct_key: '',
    item: [],
    time:15,
    score: 0,
    count:0,
    randomNumber: 0,
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    };
// 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    });
    // 获取题目
    this.onquery();
    //计时
    this.timeInterval();

  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },


  onquery: function(){
    //const db =wx.cloud.database();
    // db.collection("topic").where({
    // }).get({
    //   success: res => {
    //   }
    // })
    const db = wx.cloud.database();
    let random = Math.floor(Math.random() * 6);
    while(random == this.data.randomNumber){
      random = Math.floor(Math.random() * 6);
    }
    let topicId = "topic00" + random;
    db.collection('topic').doc(topicId).get().then(res => {
      // res.data 包含该记录的数据
      this.setData({
        topic_name: res.data.topic_name,
        item: res.data.top_key,
        correct_key: res.data.correct_key
      })
      console.log(res.data);
    })
  },



// 计时器
  timeInterval: function () {
    var that = this;
    var timer = setInterval(function () {
      // 判断是否小于0
      var nowTime = that.data.time;

      if (nowTime > 1) {
        that.setData({
          time: nowTime - 1
        });
        return 99;
      }else{
        // console.log("时间到！")
        that.setData({
          time: 0
        });
        clearInterval(99);
      }
    }, 1000);
  },



  /**提交答案，进行判断是否正确 */
  submitKey: function(event){
    var $this = this;
    let commitKey=event.currentTarget.dataset.gid;
    let commitTiem = event.currentTarget.dataset.time;
    let scoreTemp=0;
    if (commitKey == $this.data.correct_key){
      //答案正确
      if(commitTiem > 10){
        scoreTemp =20 * commitTiem;
      }else if(commitTiem > 5){
        scoreTemp = 15 * commitTiem;
      }else{
        scoreTemp = 10 * commitTiem;
      }
    }
    scoreTemp = scoreTemp + $this.data.score;
    $this.setData({
      score:scoreTemp,
    });
    //count记录下当前是第几题，score 统计总共得分。存入缓存
    wx.setStorage({
      key: "count",
      data: $this.data.count
    });
    wx.setStorage({
      key: "score",
      data: $this.data.score
    });
    wx.redirectTo({
      url: '../topic2/topic2',
    });
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var count;
    var score;
    var randomNumber;
    try {
      //不是第一题
      count = wx.getStorageSync('count');
      score = wx.getStorageSync('score');
      randomNumber = wx.getStorageSync('randomNumber');
    } catch (e) {
      //开始答题第一题
      count=0;
      score=0;
      randomNumber =0;
    }
    console.log("count:" + count);
    console.log("score:" + score);
    //如果大于10题，则结束游戏，显示最终得分。
    if (count >= 6) {
      count=0;
      score = 0;
      randomNumber = 0;
    }
    if (count < 6) {
      count++;
    }
    this.setData({
      count: count,
      score: score,
      randomNumber: randomNumber,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})