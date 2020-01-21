// pages/classify/classify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: [],
    classify_book: [],
  },

  swichNav: function (e) {
    var that = this
    var cur = e.target.dataset.current;
    var sid = e.target.dataset.sid;
    console.log(cur + '========cur'  +  '.......................'  + sid + '===========sid')
    for (let i = 0; i < that.data.classify.length;i++){
      if(sid == that.data.classify[i].id){
         that.setData({
        current_classify: i
      })
      }
    }
    // if (that.data.currentTaB == cur) { return false; }
    // else {
      // that.setData({
      //   current_classify: cur
      // })
    //分类书籍内容接口
    // var sid = options.sid   //书籍所在的分类id
    var params = {
      sid: sid
    }
    app.dsh.classify_book(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          classify_book: d.data.data
        })
        console.log(d.data.data + '===============that.data.classify_book ')
        
      }
      else{
        that.setData({
          classify_book: ''
        })
        console.log(d.data.msg)
      }
    })

    // }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。 
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // that.setData({ current_classify : options.sid - 1 })
    // console.log(that.data.current_classify + '==========current_classify')

    //分类滚动项接口
    var params = {

    }
    app.dsh.classify(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          classify: d.data.data
        })
        for (let i = 0; i < that.data.classify.length; i++) {
          if (sid == that.data.classify[i].id) {
            that.setData({
              current_classify: i
            })
          }
        }
        console.log(that.data.classify)
      }
    })

    //分类书籍内容接口
    var sid = options.sid   //书籍所在的分类id
    console.log(sid + '===========sid')
    var params = {
        sid : sid 
    }
    app.dsh.classify_book(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          classify_book: d.data.data
        })
        console.log(that.data.classify_book + '===============that.data.classify_book ')
      }
      else {
        console.log(d.data.msg)
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