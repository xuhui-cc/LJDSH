// pages/first_page/first_page.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin: false,
    classification: [],
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    book_axis: [],
    
  },

  swichNav: function (e) {
    var that = this
    var cur = e.target.dataset.current;
      
    that.setData({
      current_month: cur
    })

    if (cur == 11) {
      var starttime = that.data.date + '/' + (cur + 1 < 10 ? '0' + (cur + 1) : cur + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
      var endtime = (parseInt(that.data.date) + 1) + '/' + '01' + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
    } else {
     
      var starttime = that.data.date + '/' + (cur + 1 < 10 ? '0' + (cur + 1) : cur + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
      var endtime = that.data.date + '/' + (cur + 2 < 10 ? '0' + (cur + 2) : cur + 2) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
    }

    
    console.log(starttime + '==========starttime,swichNav')
    console.log(endtime + '==========endtime')
    var startline = (Date.parse(starttime))/1000
    var endline = (Date.parse(endtime)) / 1000
    console.log(startline + '==========startline')
    console.log(endline + '==========endline')

    var params = {
      startline: startline,
      endline: endline
    }
    app.dsh.book_axis(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          book_axis: d.data.data,
          axis: true
        })
        console.log(that.data.book_axis + '================= swichNav_that.data.book_axis')
      }
      else {
        console.log(d.data.msg)
        that.setData({
          
          axis: false
        })
      }
    })

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

//搜索按钮
  search: function() {
    wx.navigateTo({
      url: "/pages/search/search"
    })
  },
  //广告条跳转
  ad_detail: function (e) {
    var bid = e.currentTarget.dataset.bid
    var url = e.currentTarget.dataset.url
    if(bid == 0) {
      wx.navigateTo({
        url: '/pages/web_view/web_view?url=' + url
      })
    }else{
      wx.navigateTo({
        url: '/pages/book_detail/book_detail?bid=' + bid
      })
    }
    
  },
  //书籍详情页跳转
  to_book_detail: function (e) {
    var bid = e.currentTarget.dataset.bid
    wx.navigateTo({
      url: '/pages/book_detail/book_detail?bid=' + bid
    })
  },

  //分类选择
  classification_select: function (e) {
    var sid = e.currentTarget.dataset.sid
    // var lesson_id = e.currentTarget.dataset.lesson_id
    // console.log(e)
    wx.navigateTo({
      url: '/pages/classify/classify?sid=' + sid
    })
    console.log(sid + '========sid')
  },


//时间书轴年份选择
  bindDateChange: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      date: e.detail.value
    })

    if (that.data.current_month == 11) {
      var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
      var endtime = ( parseInt(that.data.date) + 1) + '/' + '01' + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
    } else {
      var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
      var endtime = that.data.date + '/' + (that.data.current_month + 2 < 10 ? '0' + (that.data.current_month + 2) : that.data.current_month + 2) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
    }

    console.log(starttime + '==========starttime')
    console.log(endtime + '==========endtime/时间书轴年份选择')
    var startline = (Date.parse(starttime)) / 1000
    var endline = (Date.parse(endtime)) / 1000
    console.log(startline + '==========startline')
    console.log(endline + '==========endline')

    var params = {
      startline: startline,
      endline: endline
    }
    app.dsh.book_axis(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          book_axis: d.data.data,
          axis: true
        })
        console.log(that.data.book_axis + '================= picker_that.data.book_axis')
      }
      else {
        console.log(d.data.msg)
        that.setData({

          axis: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var islogin = wx.getStorageSync("islogin")
    if(islogin == ''){
      that.setData({islogin : false})
      console.log(that.data.islogin + "===========islogin")
    }else{
      that.setData({ islogin: wx.getStorageSync("islogin") })
      console.log(that.data.islogin + "===========islogin")
    }
    
    
    
    var params = {

    }
    app.dsh.book_years(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          maxyear: parseInt(d.data.data.maxyear),
          minyear: parseInt(d.data.data.minyear)
        })
        console.log(that.data.maxyear + "=============maxyear")
        console.log(that.data.minyear + "=============minyear")

        var date = new Date()
        

        
        var current_month = date.getMonth()
      
        that.setData({
          date: date.getFullYear(),
          current_month: current_month,
          toView: "item" + current_month
        })

        //今天是今年的第几周
        var year_week = that.getYearWeek(date.getFullYear(), date.getMonth() + 1 , date.getDate())
        wx.setStorageSync("year_week", year_week)
        console.log(year_week + "==============year_week")


        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        var share_year = that.data.date + '.' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '.' + day
        that.setData({share_year: share_year})

        console.log(share_year +'===============================share_year')


        if (that.data.current_month == 11) {
          var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
          var endtime = (parseInt(that.data.date) + 1) + '/' + '01' + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
        } else {
          var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
          var endtime = that.data.date + '/' + (that.data.current_month + 2 < 10 ? '0' + (that.data.current_month + 2) : that.data.current_month + 2) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
        }


        console.log(starttime + '==========starttime')
        console.log(endtime + '==========endtime/onLoad')
        var startline = (Date.parse(starttime)) / 1000
        var endline = (Date.parse(endtime)) / 1000
        console.log(startline + '==========startline')
        console.log(endline + '==========endline')

        var params = {
          startline: startline,
          endline: endline
        }
        app.dsh.book_axis(params).then(d => {
          if (d.data.code == 200) {
            that.setData({
              book_axis: d.data.data,
              axis: true
            })
            console.log(that.data.book_axis + '================= swichNav_that.data.book_axis')
          }
          else {
            console.log(d.data.msg)
            that.setData({

              axis: false
            })
          }
        })
        
        console.log(that.data.book_year +"================that.data.book_year")
      }
    })

    
    var params = {

    }
    app.dsh.classify(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          classification: d.data.data
        })
        console.log(that.data.classification)
      }
    })

    var params = {

    }
    app.dsh.recommend(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          hotbook: d.data.data
        })
        console.log(that.data.hotbook)
      }
    })

    var params = {

    }
    app.dsh.ad(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          ad: d.data.data
        })
        console.log(that.data.classification)
      }
    })

    

    

    var params = {
     
    }
    app.dsh.share_poster(params).then(d => {
      if (d.data.code == 200) {
        that.setData({share: d.data.data})
        wx.setStorageSync("background", that.data.share[0].banner)
        wx.setStorageSync("ewm", that.data.share[0].ewm)

        var params = {
          token: wx.getStorageSync("token"),
          avatar: wx.getStorageSync("avatar")

        }
        app.dsh.getavatar(params).then(d => {
          if (d.data.code == 200) {
            that.setData({
              getavatar: "https://dsh.lingjun.net" + d.data.data.url
            })
            wx.setStorageSync("getavatar", that.data.getavatar)

            if (that.data.islogin == false) {
              let promise2 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("background"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              let promise3 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("ewm"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              Promise.all([promise2, promise3]).then(res => {
                // Promise.all([promise1]).then(res => {
                wx.showLoading({
                  title: '每日分享生成中...',
                  icon: 'loading',
                  duration: 1000
                })

                // var erweima = that.data.erweima
                var background = res[0].path
                var ewm = res[1].path
                that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


              })


            } else {
              let promise1 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("getavatar"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              // 2获取打卡背景
              let promise2 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("background"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              // 2获取二维码背景
              let promise3 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("ewm"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              //获取背景网络图片
              Promise.all([promise1, promise2, promise3]).then(res => {
                // Promise.all([promise1]).then(res => {
                wx.showLoading({
                  title: '每日分享生成中...',
                  icon: 'loading',
                  duration: 1000
                })
                var touxiang = res[0].path
                var nickName = "   " + wx.getStorageSync("nick")
                // var erweima = that.data.erweima
                var background = res[1].path
                var ewm = res[2].path

                that.poster(touxiang, nickName, background, ewm)

              })

            }
            // console.log(that.data.classification)
          }
          else{
            let promise2 = new Promise(function (resolve, reject) {
              wx.getImageInfo({
                src: wx.getStorageSync("background"),
                success: function (res) {
                  console.log(res);
                  resolve(res);
                }
              })
            })
            let promise3 = new Promise(function (resolve, reject) {
              wx.getImageInfo({
                src: wx.getStorageSync("ewm"),
                success: function (res) {
                  console.log(res);
                  resolve(res);
                }
              })
            })
            Promise.all([promise2, promise3]).then(res => {
              // Promise.all([promise1]).then(res => {
              wx.showLoading({
                title: '每日分享生成中...',
                icon: 'loading',
                duration: 1000
              })

              // var erweima = that.data.erweima
              var background = res[0].path
              var ewm = res[1].path
              that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


            })
          }
        })

        
    
      } else {
        console.log("每日分享接口错误")
      }
    })

    
    

    
   
    },
    
  getuserinfo: function (e) {
    let that = this
    that.setData({
      bc: 0
    })
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
                    if (d.data.code == 200){
                      console.log(d.data.data)
                      that.setData({ islogin: true })
                      wx.setStorageSync("islogin", that.data.islogin)
                      wx.setStorageSync("token", d.data.data.token)
                      wx.setStorageSync("nick", d.data.data.nick)
                      wx.setStorageSync("avatar", d.data.data.avatar)
                      // 
                      var params = {

                      }
                      app.dsh.share_poster(params).then(d => {
                        if (d.data.code == 200) {
                          that.setData({ share: d.data.data })
                          wx.setStorageSync("background", that.data.share[0].banner)
                          wx.setStorageSync("ewm", that.data.share[0].ewm)

                          var params = {
                            token: wx.getStorageSync("token"),
                            avatar: wx.getStorageSync("avatar")

                          }
                          app.dsh.getavatar(params).then(d => {
                            if (d.data.code == 200) {
                              that.setData({
                                getavatar: "https://dsh.lingjun.net" + d.data.data.url
                              })
                              wx.setStorageSync("getavatar", that.data.getavatar)

                              if (that.data.islogin == false) {
                                let promise2 = new Promise(function (resolve, reject) {
                                  wx.getImageInfo({
                                    src: wx.getStorageSync("background"),
                                    success: function (res) {
                                      console.log(res);
                                      resolve(res);
                                    }
                                  })
                                })
                                let promise3 = new Promise(function (resolve, reject) {
                                  wx.getImageInfo({
                                    src: wx.getStorageSync("ewm"),
                                    success: function (res) {
                                      console.log(res);
                                      resolve(res);
                                    }
                                  })
                                })
                                Promise.all([promise2, promise3]).then(res => {
                                  // Promise.all([promise1]).then(res => {
                                  wx.showLoading({
                                    title: '每日分享生成中...',
                                    icon: 'loading',
                                    duration: 1000
                                  })

                                  // var erweima = that.data.erweima
                                  var background = res[0].path
                                  var ewm = res[1].path
                                  that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


                                })


                              } else {
                                let promise1 = new Promise(function (resolve, reject) {
                                  wx.getImageInfo({
                                    src: wx.getStorageSync("getavatar"),
                                    success: function (res) {
                                      console.log(res);

                                      resolve(res);
                                    }
                                  })
                                })
                                // 2获取打卡背景
                                let promise2 = new Promise(function (resolve, reject) {
                                  wx.getImageInfo({
                                    src: wx.getStorageSync("background"),
                                    success: function (res) {
                                      console.log(res);
                                      resolve(res);
                                    }
                                  })
                                })
                                // 2获取二维码背景
                                let promise3 = new Promise(function (resolve, reject) {
                                  wx.getImageInfo({
                                    src: wx.getStorageSync("ewm"),
                                    success: function (res) {
                                      console.log(res);
                                      resolve(res);
                                    }
                                  })
                                })
                                //获取背景网络图片
                                Promise.all([promise1, promise2, promise3]).then(res => {
                                  // Promise.all([promise1]).then(res => {
                                  wx.showLoading({
                                    title: '每日分享生成中...',
                                    icon: 'loading',
                                    duration: 1000
                                  })
                                  var touxiang = res[0].path
                                  var nickName = "   " + wx.getStorageSync("nick")
                                  // var erweima = that.data.erweima
                                  var background = res[1].path
                                  var ewm = res[2].path

                                  that.poster(touxiang, nickName, background, ewm)


                                })

                              }

                              // console.log(that.data.classification)
                            }
                            else {
                              let promise2 = new Promise(function (resolve, reject) {
                                wx.getImageInfo({
                                  src: wx.getStorageSync("background"),
                                  success: function (res) {
                                    console.log(res);
                                    resolve(res);
                                  }
                                })
                              })
                              let promise3 = new Promise(function (resolve, reject) {
                                wx.getImageInfo({
                                  src: wx.getStorageSync("ewm"),
                                  success: function (res) {
                                    console.log(res);
                                    resolve(res);
                                  }
                                })
                              })
                              Promise.all([promise2, promise3]).then(res => {
                                // Promise.all([promise1]).then(res => {
                                wx.showLoading({
                                  title: '每日分享生成中...',
                                  icon: 'loading',
                                  duration: 1000
                                })

                                // var erweima = that.data.erweima
                                var background = res[0].path
                                var ewm = res[1].path
                                that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


                              })
                            }
                          })

                          
                        } else {
                          console.log("每日分享接口错误")
                        }
                      })


                    }else {
                      console.log(d.data.code)
                      console.log(d.data.msg)
                    }
                    
                  })
                }
              })

            }
          })
        }
      }
    })

  },

  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          title: '保存成功',
          content: '图片已保存到相册，赶紧晒一下吧！',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              that.setData({ maskHidden: false });
            }
          }, fail: function (res) {
            console.log("保存照片错误")
          }
        })
      }, fail: function (res) {
        if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }

      }
    })
  },

  //今天是今年的第几周
  getYearWeek: function (a, b, c) {
    /*  
    date1是当前日期  
    date2是当年第一天  
    d是当前日期是今年第多少天  
    用d + 当前年的第一天的周差距的和在除以7就是本年第几周  
    */
    var date1 = new Date(a, parseInt(b) - 1, c),
      date2 = new Date(a, 0, 1),
      d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
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

    var islogin = wx.getStorageSync("islogin")
    if (islogin == '') {
      that.setData({ islogin: false })
      console.log(that.data.islogin + "===========islogin")
    } else {
      that.setData({ islogin: wx.getStorageSync("islogin") })
      console.log(that.data.islogin + "===========islogin")
    }
    // that.onLoad()
    var params = {

    }
    app.dsh.book_years(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          maxyear: parseInt(d.data.data.maxyear),
          minyear: parseInt(d.data.data.minyear)
        })
        console.log(that.data.maxyear + "=============maxyear")
        console.log(that.data.minyear + "=============minyear")

        var date = new Date()



        var current_month = date.getMonth()

        that.setData({
          date: date.getFullYear(),
          // current_month: current_month,
          // toView: "item" + current_month
        })

        //今天是今年的第几周
        var year_week = that.getYearWeek(date.getFullYear(), date.getMonth() + 1, date.getDate())
        wx.setStorageSync("year_week", year_week)
        console.log(year_week + "==============year_week")


        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        var share_year = that.data.date + '.' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '.' + day
        that.setData({ share_year: share_year })

        console.log(share_year + '===============================share_year')


        if (that.data.current_month == 11) {
          var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
          var endtime = (parseInt(that.data.date) + 1) + '/' + '01' + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
        } else {
          var starttime = that.data.date + '/' + (that.data.current_month + 1 < 10 ? '0' + (that.data.current_month + 1) : that.data.current_month + 1) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
          var endtime = that.data.date + '/' + (that.data.current_month + 2 < 10 ? '0' + (that.data.current_month + 2) : that.data.current_month + 2) + '/' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
        }


        console.log(starttime + '==========starttime')
        console.log(endtime + '==========endtime/onLoad')
        var startline = (Date.parse(starttime)) / 1000
        var endline = (Date.parse(endtime)) / 1000
        console.log(startline + '==========startline')
        console.log(endline + '==========endline')

        var params = {
          startline: startline,
          endline: endline
        }
        app.dsh.book_axis(params).then(d => {
          if (d.data.code == 200) {
            that.setData({
              book_axis: d.data.data,
              axis: true
            })
            console.log(that.data.book_axis + '================= swichNav_that.data.book_axis')
          }
          else {
            console.log(d.data.msg)
            that.setData({

              axis: false
            })
          }
        })

        console.log(that.data.book_year + "================that.data.book_year")
      }
    })


    var params = {

    }
    app.dsh.classify(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          classification: d.data.data
        })
        console.log(that.data.classification)
      }
    })

    var params = {

    }
    app.dsh.recommend(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          hotbook: d.data.data
        })
        console.log(that.data.hotbook)
      }
    })

    var params = {

    }
    app.dsh.ad(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          ad: d.data.data
        })
        console.log(that.data.classification)
      }
    })





    var params = {

    }
    app.dsh.share_poster(params).then(d => {
      if (d.data.code == 200) {
        that.setData({ share: d.data.data })
        wx.setStorageSync("background", that.data.share[0].banner)
        wx.setStorageSync("ewm", that.data.share[0].ewm)

        var params = {
          token: wx.getStorageSync("token"),
          avatar: wx.getStorageSync("avatar")

        }
        app.dsh.getavatar(params).then(d => {
          if (d.data.code == 200) {
            that.setData({
              getavatar: "https://dsh.lingjun.net" + d.data.data.url
            })
            wx.setStorageSync("getavatar", that.data.getavatar)

            if (that.data.islogin == false) {
              let promise2 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("background"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              let promise3 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("ewm"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              Promise.all([promise2, promise3]).then(res => {
                // Promise.all([promise1]).then(res => {
                wx.showLoading({
                  title: '每日分享生成中...',
                  icon: 'loading',
                  duration: 1000
                })

                // var erweima = that.data.erweima
                var background = res[0].path
                var ewm = res[1].path
                that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


              })


            } else {
              let promise1 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("getavatar"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              // 2获取打卡背景
              let promise2 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("background"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              // 2获取二维码背景
              let promise3 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: wx.getStorageSync("ewm"),
                  success: function (res) {
                    console.log(res);
                    resolve(res);
                  }
                })
              })
              //获取背景网络图片
              Promise.all([promise1, promise2, promise3]).then(res => {
                // Promise.all([promise1]).then(res => {
                wx.showLoading({
                  title: '每日分享生成中...',
                  icon: 'loading',
                  duration: 1000
                })
                var touxiang = res[0].path
                var nickName = "   " + wx.getStorageSync("nick")
                // var erweima = that.data.erweima
                var background = res[1].path
                var ewm = res[2].path

                that.poster(touxiang, nickName, background, ewm)

              })

            }

            // console.log(that.data.classification)
          }
          else {
            let promise2 = new Promise(function (resolve, reject) {
              wx.getImageInfo({
                src: wx.getStorageSync("background"),
                success: function (res) {
                  console.log(res);
                  resolve(res);
                }
              })
            })
            let promise3 = new Promise(function (resolve, reject) {
              wx.getImageInfo({
                src: wx.getStorageSync("ewm"),
                success: function (res) {
                  console.log(res);
                  resolve(res);
                }
              })
            })
            Promise.all([promise2, promise3]).then(res => {
              // Promise.all([promise1]).then(res => {
              wx.showLoading({
                title: '每日分享生成中...',
                icon: 'loading',
                duration: 1000
              })

              // var erweima = that.data.erweima
              var background = res[0].path
              var ewm = res[1].path
              that.poster("../../images/wutouxiang.png", "    去登录", background, ewm)


            })
          }
        })

       
      } else {
        console.log("每日分享接口错误")
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.hideLoading();
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

  },

  poster: function (touxiang, nickName, background,ewm){
    let that = this
    var rpx;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        rpx = res.windowWidth / 375
      },
    })

    const context = wx.createCanvasContext('mycanvas')


    context.save();
    context.fillStyle = '#E4E4E4';
    context.shadowBlur = 18; // 模糊尺寸
    context.shadowColor = '#E4E4E4'; // 颜色#FF5757

    context.beginPath();
    context.rect(19* rpx, 16 * rpx, 338 * rpx, 393 * rpx)
    context.fill();
    context.restore();
    
 
    context.beginPath()
    context.arc(15 * rpx + 12 * rpx, 12 * rpx + 12 * rpx, 12 * rpx, Math.PI, Math.PI * 1.5);
    context.moveTo(15 * rpx + 12 * rpx, 12 * rpx);
    context.lineTo(15 * rpx + 345 * rpx - 24 * rpx, 12 * rpx);
    // context.lineTo(15 * rpx + 345 * rpx, 12 * rpx + 12 * rpx);

    context.arc(15 * rpx + 345 * rpx - 12 * rpx, 12 * rpx + 12 * rpx, 12 * rpx, Math.PI * 1.5, Math.PI * 2);
    context.lineTo(15 * rpx + 345 * rpx, 12 * rpx + 400 * rpx - 12 * rpx);
    context.lineTo(15 * rpx + 345 * rpx - 12 * rpx, 12 * rpx + 400 * rpx);

    context.arc(15 * rpx + 345 * rpx - 12 * rpx, 12 * rpx + 400 * rpx - 12 * rpx, 12 * rpx, 0, Math.PI * 0.5);
    context.lineTo(15 * rpx + 12 * rpx, 12 * rpx + 400 * rpx);
    context.lineTo(15 * rpx, 12 * rpx + 400 * rpx - 12 * rpx);

    context.arc(15 * rpx + 12 * rpx, 12 * rpx + 400 * rpx - 12 * rpx, 12 * rpx, Math.PI * 0.5, Math.PI);
    // context.lineTo(15 * rpx, 12 * rpx + 12 * rpx);
    // context.lineTo(15 * rpx + 12 * rpx, 12 * rpx);

    context.arc(15 * rpx + 12 * rpx, 12 * rpx + 400 * rpx - 12 * rpx, 12 * rpx, Math.PI * 0.5, Math.PI);
    context.lineTo(15 * rpx, 12 * rpx + 12 * rpx);
    context.lineTo(15 * rpx + 12 * rpx, 12 * rpx);
    // context.fillStyle = "blue"
    // // 开始填充
    // context.fill()
    context.closePath();
    // context.fill();
    context.clip()
    context.drawImage(background, 15 * rpx, 12 * rpx, 345 * rpx, 147 * rpx)
    context.drawImage("../../images/ccccs.png", 15 * rpx, 145 * rpx, 345 * rpx, 269 * rpx)
    context.restore() // 返回上一状态

    // context.save();
    // context.beginPath();
    // context.arc(70 * rpx, (164 * rpx), 34 * rpx, 0, 2 * Math.PI);
    // context.closePath();
    // // context.fill();
    // context.clip()
    
    
    
    
    context.drawImage(touxiang, 36 * rpx, 130 * rpx, 68 * rpx, 68 * rpx)
    context.restore() // 返回上一状态


   
    
    
    // // 画白背景
    // context.setFillStyle('white')
    // // context.drawImage("../../images/ccccs.png", 15 * rpx, 12 * rpx, 345 * rpx, 444 * rpx)
    


    //画读书会图标
    // context.setFillStyle('white')
    // context.drawImage("../../images/ljdsh.png", 15 * rpx, 27 * rpx, 85 * rpx, 24 * rpx)

   
    //画昵称
    context.restore()
    context.beginPath()
    context.setFontSize(13 * rpx)
    context.setFillStyle('#3A3A3A')
    context.setTextAlign('left')
    context.fillText(nickName, 100 * rpx, 170 * rpx)
    context.stroke()
  
    //画日期
    if(that.data.islogin){
      context.restore()
      context.beginPath()
      context.setFontSize(11 * rpx)
      context.setFillStyle('#808080')
      context.setTextAlign('left')
      context.fillText(this.data.share_year + ' 正在领军读书会上读这篇文章', 110 * rpx, 190 * rpx)
      context.stroke()
    }
    

    //画标题书名
    context.beginPath()
    context.font = 'bold 17px PingFang SC'
    context.setFillStyle('#1A1A1A')
    // contexttextBaseline = "top"
    // context.textBaseline = "bottom";
    context.setTextAlign('left')
    var text ="《" + that.data.share[0].title + "》"//这是要绘制的文本
    // var text = "哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或"//这是要绘制的文本
    
    let textWidth = context.measureText(text).width;
    const ellipsis = '…';
    const ellipsisWidth = context.measureText(ellipsis).width;
    if (textWidth <= (265 * rpx)){
      
      context.fillText(text, (30 * rpx), (235 * rpx))
    } else {
      var len = text.length;
      while (textWidth >= (265 * rpx) - ellipsisWidth && len-- > 0) {
        text = text.slice(0, len);
        textWidth = context.measureText(text).width;
      }
      
      context.fillText(text + ellipsis, (30 * rpx), (235 * rpx))
    }
     
    context.stroke()

    //画书籍介绍
    if (that.data.share[0].share_intro){
      context.beginPath()
      var text = that.data.share[0].share_intro;//这是要绘制的文本
      var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
      console.log(chr +'=========================================chr')
      var temp = "";
      var row = [];
      context.font = '12px PingFang SC'
      context.setFillStyle("#808080")
      for (var a = 0; a < chr.length; a++) {
        if (context.measureText(temp).width < (280 * rpx)) {
          temp += chr[a];
          console.log(temp +'======================================remp1')
        }
        else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
          console.log(temp + '======================================remp2')
        }
      }
      row.push(temp);
      console.log(row)

      //如果数组长度大于2 则截取前两个
      if (row.length > 2) {

        var rowCut = row.slice(0, 5);
        console.log(rowCut)
        var rowPart = rowCut[2];
        console.log(rowPart + "======================rowPart")
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (context.measureText(test).width < (280 * rpx)) {
            test += rowPart[a];
          }

          else {
            break;
          }
        }
        empty.push(test);
        console.log(empty + '======================empty')
        var group = empty[0] + "..."//这里只显示两行，超出的用...表示
        console.log(group)
        
        
        row = rowCut.splice(0, 3, group);
        console.log(row)
        console.log(row[0] + '======================row[0]')
        console.log(row[1] + '======================row[1]')
        console.log(group + '======================group')
        context.fillText(row[0], (40 * rpx), (265 * rpx))
        context.fillText(row[1], (40 * rpx), (285 * rpx))
        context.fillText(group, (40 * rpx), (305 * rpx))
        // context.fillText(row[3], (40 * rpx), (325 * rpx))
        // context.fillText(row[4], (40 * rpx), (345 * rpx))
      } else if (row.length == 2){
        context.fillText(row[0], (40 * rpx), (265 * rpx))
        context.fillText(row[1], (40 * rpx), (285 * rpx))
      }
      else{
        context.fillText(row[0], (40 * rpx), (265 * rpx))
      }
     

    }
    context.stroke()

    //画hengxian
    context.setFillStyle('white')
    context.drawImage("../../images/heng.png", 40 * rpx, 326 * rpx, 303.5 * rpx, 1 * rpx)


    //画小程序码
    context.setFillStyle('white')
    context.drawImage(ewm, 38 * rpx, 340 * rpx, 60 * rpx, 60 * rpx)

    //画长按识别文字
    context.restore()
    context.beginPath()
    context.setFontSize(11 * rpx)

    context.setFillStyle('#808080')
    context.setTextAlign('left')
    context.fillText('识别二维码', 105 * rpx, 365 * rpx)
    context.fillText('进入领军读书会和我一起阅读吧', 105 * rpx, 385 * rpx)

    context.stroke()

    //生成临时图片 
    context.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,

          });
          // wx.hideToast()
          if(that.data.bc == 0){
            console.log("==================================bc")
            that.baocun()
            that.setData({
              bc:1
            })
          }
          
        },
        fail: function (res) {
          console.log(res);
        }
      })
      // wx.hideLoading();
    });

    

  },

})