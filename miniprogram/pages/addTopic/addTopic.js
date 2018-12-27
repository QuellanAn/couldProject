// pages/addTopic/addTopic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit: function (e) {
    const db = wx.cloud.database();
    console.log(e);
    let topic_id='';
    let topicName = e.detail.value.topicName;//题目名称
    let category = e.detail.value.category;//科目
    let correctKey = e.detail.value.correctKey;//正确答案
    let topKey1 = e.detail.value.topKey1;//混淆答案
    let topKey2 = e.detail.value.topKey2;
    let topKey3 = e.detail.value.topKey3;
    let topKey=[];
    let create_time=new Date;
    // 设置一个随机数，使得答案存入数组的顺序是随机的。
    let random = Math.floor(Math.random() * 4);
    console.log("随机数："+random);
    switch (random){
      case 0: 
        topKey.push(correctKey);
        topKey.push(topKey1);
        topKey.push(topKey3);
        topKey.push(topKey2);
        break;
      case 1:
        topKey.push(topKey1);
        topKey.push(correctKey);
        topKey.push(topKey3);
        topKey.push(topKey2);
        break;
      case 2:
        topKey.push(topKey1);
        topKey.push(topKey2);
        topKey.push(correctKey);
        topKey.push(topKey3);
        break;
      case 3:
        topKey.push(topKey3);
        topKey.push(topKey1);
        topKey.push(topKey2);
        topKey.push(correctKey);
        break;
    }
    console.log(topKey);
    console.log(create_time.getTime());
  //先从数据库中国查询出id最大记录，在此基础上id加1
  //通过创建时间来判断。
    db.collection('topic').orderBy('create_time','desc').limit(1).get({
      success: res => {
        topic_id = res.data[0]._id;
        let temp = topic_id.substring(7);
        temp++;
        topic_id = topic_id.substring(0,7)+temp;
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });


    console.log(topic_id);
    console.log(topic_id == '');


    if (topic_id == ''){
      topic_id ='topic001';
    }
    
    if (category == '' || category==null){
      category='other';
    }

    db.collection('topic').add({
      data: {
        _id:topic_id,
        topic_name: topicName, 
        correct_key: correctKey, 
        category: category, 
        top_key: topKey,
        create_time: create_time.getTime(),
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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