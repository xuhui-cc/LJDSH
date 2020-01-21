// pages/wenzhang/wenzhang.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wenzhang: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log("===============================onload")
    var islogin = wx.getStorageSync("islogin")
    if (islogin == '') {
      that.setData({ islogin: false })
      console.log(that.data.islogin + "===========islogin")
    } else {
      that.setData({ islogin: wx.getStorageSync("islogin") })
      console.log(that.data.islogin + "===========islogin")
    }
    var params = {
      
    }
    app.dsh.wenzhang(params).then(d => {
      if(d.data.code == 200){
        that.setData({
          wenzhang: d.data.data,
         
        })
        for (var i = 0; i < that.data.wenzhang.length; i++){
          var cs = 'wenzhang[' + i + '].dateline'
          // var cs = "wenzhang[' + i + '].dateline"
          that.setData({
            [cs]: that.timestampToTime(that.data.wenzhang[i].dateline)
          })
        }
        console.log(that.data.wenzhang)
      }
    })
  },

  //文章详情
  go_wenzhang_detail: function(e) {
    var wz_id = e.currentTarget.dataset.wz_id
    wx.navigateTo({
      url: '/pages/wenzhang_detail/wenzhang_detail?id=' + wz_id               //?star_num=' + star_num
    })
  },
  //时间戳转换为标准时间
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours() ) + ':'; 
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) ; 
    var s = date.getSeconds();
    return Y + M + D + h + m;
  },
    
  getuserinfo: function (e) {
    let that = this
    var index = e.currentTarget.dataset.index
    console.log(index + "======================index")
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              var nickName = res.userInfo.nickName
              var avatarUrl = res.userInfo.avatarUrl
              wx.login({
                success(login) {
                  console.log("login.code" + login.code)
                  var code = login.code

                  var params = {
                    "code": code,
                    "nickname": nickName,
                    "avatar": avatarUrl
                  }
                  console.log(params)
                  app.dsh.login(params).then(d => {
                    if (d.data.code == 200) {
                      console.log(d.data.data)

                      wx.setStorageSync("token", d.data.data.token)
                      wx.setStorageSync("nick", d.data.data.nick)
                      wx.setStorageSync("avatar", d.data.data.avatar)
                      
                    
                        that.setData({ islogin: true })
                      wx.setStorageSync("islogin", that.data.islogin)
                      wx.navigateTo({
                        url: '/pages/wenzhang_detail/wenzhang_detail?id=' + that.data.wenzhang[index].id              //?star_num=' + star_num
                      })
                        
                      

                    } else {
                      console.log(d.data.code)
                      console.log(d.data.msg)
                    }

                  })
                  wx.hideLoading()
                }
              })

            }
          })
        }
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
    that.onLoad()
   
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
    let that = this
    console.log("下拉")
    that.onLoad()

    setTimeout(function () {
      // 不加这个方法真机下拉会一直处于刷新状态，无法复位
      wx.stopPullDownRefresh()
    }, 500)
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