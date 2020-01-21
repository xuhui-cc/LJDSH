// pages/more_comment/more_comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [
      // { avatar: "../../images/avatar(1).png", name: "哇叽叽哇的小伙伴", date: "2019-10-20", star:3, detail: "逝者如斯夫，不舍昼夜 ，虽然时间看不见摸不着，但我们依然真切地感受到时间的流逝。从每天的日出日落。" },
      // { avatar: "../../images/avatar(2).png", name: "我的名字是好长好长", date: "2019-10-20", star: 4, detail: "逝者如斯夫，不舍昼夜 ，虽然时间看不见摸不着，但我们依然真切地感受到时间的流逝。从每天的日出日落。" },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var cid = options.id
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
      "cid": cid,
    }
    console.log(params)
    app.dsh.get_comment(params).then(d => {
      if (d.data.code == 200) {
        that.setData({ comment: d.data.data })
        for (var i = 0; i < that.data.comment.length; i++) {
          var cs = 'comment[' + i + '].dateline'
          // var cs = "comment[' + i + '].dateline"
          that.setData({
            [cs]: that.timestampToTime(that.data.comment[i].dateline)
          })
          console.log(that.data.comment[i].dateline)
        }
        
        console.log(d.data.msg + "获取留言接口调取成功")
      } else {
        console.log(d.data.msg + "获取留言接口调取失败")
      }


    })
  },

  //时间戳转换为标准时间
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D;
    // return Y + M + D + h + m + s;
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