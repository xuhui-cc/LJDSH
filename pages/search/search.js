// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotword: [],
    searchbook: [],
    search_content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var token = wx.getStorageSync("token")
    var params = {

    }
    console.log(params)
    app.dsh.get_hotword(params).then(d => {
      if (d.data.code == 200) {

        that.setData({
          hotword: d.data.data
        })
        console.log(that.data.hotword)
        console.log(d.data.msg + "获取热搜词接口调取成功")
      } else {
        console.log(d.data.msg + "获取热搜词接口调取失败")
      }
    })
  },
  //书籍详情页跳转
  to_book_detail: function (e) {
    var bid = e.currentTarget.dataset.bid
    wx.navigateTo({
      url: '/pages/book_detail/book_detail?bid=' + bid
    })
  },

  search_sure: function(){
    let that = this
    var token = wx.getStorageSync("token")
    that.setData({
      sure : true
    })
    var params = {
      "title": that.data.search_content,
      "token": token
    }
    console.log(params)
    app.dsh.add_keywords(params).then(d => {
      if (d.data.code == 200) {

        console.log(d.data.msg + "输入热搜词接口调取成功")
      } else {

        console.log(d.data.msg + "输入热搜词接口调取失败")
      }
    })

  },

//搜索
  search: function(e) {
    let that = this
    
    that.setData({
      sure: false
    })
    that.setData({
      search_content: e.detail.value
    })
    
    var params = {
      "search": that.data.search_content
    }
    console.log(params)
    app.dsh.search(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          searchbook: d.data.data
        })
        console.log(that.data.searchbook)
        console.log(d.data.msg + "搜索书籍接口调取成功")
      } else {
        that.setData({
          searchbook: ''
        })
        console.log(d.data.msg + "搜索书籍接口调取失败")
      }
    })
    // console.log(this.data.search_content)
  },

  hot_search:function(e){
    let that = this
    that.setData({
      search_content: e.currentTarget.dataset.search_content
    })
    var params = {
      "search": that.data.search_content
    }
    console.log(params)
    app.dsh.search(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          searchbook: d.data.data
        })
        console.log(that.data.searchbook)
        console.log(d.data.msg + "搜索书籍接口调取成功")
      } else {
        that.setData({
          searchbook: ''
        })
        console.log(d.data.msg + "搜索书籍接口调取失败")
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
    let that = this
    that.setData({
      search_content: ''
    })
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