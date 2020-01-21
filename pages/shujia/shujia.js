// pages/shujia/shujia.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mybook: [],
    edit: false,
    tip_mask: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideLoading()
    var islogin = wx.getStorageSync("islogin")
    if (islogin == '') {
      that.setData({ islogin: false })
      console.log(that.data.islogin + "===========islogin")
    } else {
      that.setData({
         islogin: wx.getStorageSync("islogin"),
          avatar: wx.getStorageSync("avatar"),
          nick: wx.getStorageSync("nick"),
  
        
        })
      console.log(that.data.islogin + "===========islogin")
    }
    
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
    }
    console.log(params)
    app.dsh.mybook(params).then(d => {
      if (d.data.code == 200) {

        that.setData({
          mybook: d.data.data
        })
        console.log(that.data.mybook)
        console.log(d.data.msg + "我的书籍接口调取成功")
      } else {
        console.log(d.data.msg + "我的书籍接口调取失败")
        that.setData({
          mybook: ''
        })
      }
    })

    that.get_readtime()

    
  },

  get_readtime:function(){
    let that = this
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
    }
    console.log(params)
    app.dsh.get_readtime(params).then(d => {
      if (d.data.code == 200) {
        var year_week = wx.getStorageSync("year_week")
        var timestamp = Date.parse(new Date()) / 1000;

        if (year_week == d.data.data.week){
          that.setData({
            week_hour: that.hour_shift(d.data.data.weekline),
            week_min: that.min_shift(d.data.data.weekline),
            total_hour: that.hour_shift(d.data.data.totalline),
            total_min: that.min_shift(d.data.data.totalline),
          })
          console.log(that.data.week_hour + "============week_hour")
          console.log(that.data.week_min + "============week_min")
          console.log(that.data.total_hour + "============total_hour")
          console.log(that.data.total_min + "============total_min")
        }else {
          console.log("周不同")
          that.set_read_time(token,year_week,timestamp)
        }

        
        // console.log(that.data.mybook)


        console.log(d.data.msg + "读书时长接口调取成功")
      } else {
        console.log(d.data.msg + "读书时长接口调取失败")
      }


    })

  },

  set_read_time: function (token, year_week, timestamp) {
    let that = this

    var params = {
      "token": token,
      "week": year_week,
      "dateline": timestamp,
      "btn": 1
    }
    app.dsh.post_readtime(params).then(d => {
      console.log(d)
      if (d.data.code == 200) {
        that.get_readtime()
        
        console.log(d.data.msg + '============阅读时间返回成功')
      } else {
        console.log(d.data.msg + '============阅读时间返回失败')
        // console.log("接口错误")
      }
    })
  },

  //秒和时分秒的转换
  hour_shift : function(s) {
    let that = this
    var t_hour;
    

    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        t_hour = '0' + hour;
      } else {
        t_hour = hour;
      }
    }
    else {
      console.log("请确认读书时间")
      t_hour = '00';
    }
  
    return t_hour;
  },

  min_shift: function (s) {
    let that = this
    var t_min;
    

    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
     
      if (min < 10) {
        t_min = '0' + min;
      } else {
        t_min = min;
      }
    }
    else {
      console.log("请确认读书时间")
      t_min = '00';
    }
    
    return t_min;
  },

  getuserinfo: function (e) {
    let that = this
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
                      that.setData({ islogin: true })
                      wx.setStorageSync("islogin", that.data.islogin)
                      wx.setStorageSync("token", d.data.data.token)
                      wx.setStorageSync("nick", d.data.data.nick)
                      wx.setStorageSync("avatar", d.data.data.avatar)
                      // that.setData({
                      //   avatar: d.data.data.avatar,
                      //   nick: d.data.data.nick
                      // })
                      that.onLoad()
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


//编辑按钮
edit: function() {
  var edit = ( ! this.data.edit)
  this.setData({
    edit : edit
  })
  console.log(this.data.edit)
},

//垃圾桶事件
del: function(e) {
  var book_title = e.currentTarget.dataset.book_title
  var bid = e.currentTarget.dataset.bid
  this.setData({
    tip_mask: true,
    book_title: book_title,
    bid: bid
  })
},

  //蒙层取消事件
  no: function () {
    this.setData({
      tip_mask: false,
    })
  },

  //蒙层确定事件
  yes: function () {
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
      "id" : this.data.bid
    }
    console.log(params)
    app.dsh.del_mybook(params).then(d => {
      if (d.data.code == 200) {
        console.log(d.data.msg + "移出我的书籍接口调取成功")
        this.onLoad()
      } else {
        console.log(d.data.msg + "移出我的书籍接口调取失败")
      }


    })

    this.setData({
      tip_mask: false,
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
    this.onLoad()
    this.setData({
      edit: false
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