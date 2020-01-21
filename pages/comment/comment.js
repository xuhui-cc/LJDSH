// pages/comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: [],//点亮的星星数
    gray: [],//没有点亮的星星数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var star = []
    var gray = []
    var bid = options.bid
    that.setData({bid:bid})
    var star_num = options.star_num
    // that.setData({ cs_star: star_num})
    for (let i = 0; i < star_num; i++){
      star.push(i)
    }
    console.log(star)
    that.setData({
      star_num: star_num,
      star: star
    })
    for (let j = 0; j < 5 - star_num; j++) {
      gray.push(j)
    }
    console.log(gray)
    that.setData({
      gray: gray
    })
    // that.setData({
    //   one_1: options.star_num,
    //   two_1: 5 - options.star_num
    // })
  },


  comment_star1:function(e){
    let that = this
    var star = []
    var gray = []
    var star_num = Number(e.currentTarget.id)
    console.log(star_num)
    for (let i = 0; i < star_num; i++) {
      star.push(i)
    }
    console.log(star)
    that.setData({
      star_num: star_num,
      star: star
    })
    for (let j = 0; j < 5 - star_num; j++) {
      gray.push(j)
    }
    console.log(gray)
    that.setData({
      gray: gray
    })
  },
  comment_star2: function (e) {
    let that = this
    var star = []
    var gray = []
    var star_cccs = Number(e.currentTarget.id)
    console.log(star_cccs)
    // that.setData({ star_cccs: star_cccs})
    if (star_cccs < 5){
      var star_new = Number(that.data.star_num) + star_cccs
      for (let i = 0; i < star_new; i++) {
        star.push(i)
      }
      console.log(star)
      that.setData({
        star_num: star_new ,
        star: star
      })
      for (let j = 0; j < 5 - star_new; j++) {
        gray.push(j)
      }
      console.log(gray)
      that.setData({
        gray: gray
      })
    }
   
  },
  

  comment: function(e){
    let that = this
    var content = e.detail.value
    
    console.log(content.length + '++++++++++++++++length')
    if (content.length >= 500){
      wx.showToast({
        title: '评论不能超过500字哦~',
        icon: 'none',
        duration: 2000
      })
      if (content.length == 500){
        that.setData({
          content: content
        })
        console.log(that.data.content + '++++++++++500')
      }
    }
    else{
      that.setData({
        content: content
      })
      console.log(that.data.content)
    }
  },

  //发表评论
  post_comment: function() {
    let that = this
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
      "cid": that.data.bid,
      "content": that.data.content,
      "star" : that.data.star_num
    }
    console.log(params)
    app.dsh.post_comment(params).then(d => {
      if (d.data.code == 200) {
        wx.showToast({
          title: '评论成功',
          icon: 'succeed',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/book_detail/book_detail?bid=' + that.data.bid
        })
        console.log(d.data.msg + "发表评论接口调取成功")
      } else {
        console.log(d.data.msg + "发表评论接口调取失败")
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