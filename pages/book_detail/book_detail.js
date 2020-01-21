// pages/book_detail/book_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 4,//后端给的分数，显示的星星
    one_1: '',//点亮的星星数
    two_1: '',//没有点亮的星星数
    two_2: 5,//没有点亮的星星数
    // add: false,
   
    
    current: 0,
    catelog: [],

    caption: ["推荐语", "目录"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var token = wx.getStorageSync("token")
    that.setData({bid:options.bid})
    var islogin = wx.getStorageSync("islogin")
    if (islogin == '') {
      that.setData({ islogin: false })
      console.log(that.data.islogin + "===========islogin")
    } else {
      that.setData({ islogin: wx.getStorageSync("islogin") })
      console.log(that.data.islogin + "===========islogin")
    }

    that.setData({
      one_1: this.data.num,
      two_1: 5 - this.data.num
    })

    that.get_book_detail(that.data.bid,token)


  },

  //获取书籍详情接口
  get_book_detail : function(bid,token){
    let that =  this
    
    var params = {
      "token": token,
      "id": bid,
    }
    console.log(params)
    app.dsh.book_detail(params).then(d => {
      if (d.data.code == 200) {

        that.setData({
          book_detail: d.data.data
        })
        console.log(that.data.book_detail)
        var cs = 'book_detail.dateline'
        // var cs = "book_detail[' + i + '].dateline"
        that.setData({
          [cs]: that.timestampToTime(that.data.book_detail.dateline)
        })

        //阅读章节判断
        var params = {
          "token": token,
          "bid": d.data.data.id,
        }
        console.log(params)
        app.dsh.book_chapter(params).then(d => {
          if (d.data.code == 200) {

            that.setData({
              last_chapter: d.data.data.cid,
              isread : true
            })
            console.log(that.data.last_chapter)

            console.log(d.data.msg + "书籍阅读章节接口调取成功")
          } else {
            that.setData({
              last_chapter: 0,
              isread: false
            })
            console.log(that.data.last_chapter)
            console.log(d.data.msg + "书籍阅读章节接口调取失败")
          }


        })

        var params = {

          "cid": d.data.data.id,
        }
        console.log(params)
        app.dsh.get_book_comment(params).then(d => {
          if (d.data.code == 200) {

            that.setData({
              book_comment: d.data.data
            })
            var cs = 'book_comment.dateline'
            // var cs = "book_comment[' + i + '].dateline"
            that.setData({
              [cs]: that.timestampToTime(that.data.book_comment.dateline)
            })
            console.log(that.data.book_comment)


            console.log(d.data.msg + "书籍详情评论接口调取成功")
          } else {
            that.setData({
              book_comment: ''
            })
            console.log(d.data.msg + "书籍详情评论接口调取失败")
          }


        })

        var params = {

          "cid": d.data.data.id,
        }
        console.log(params)
        app.dsh.get_good_comment(params).then(d => {
          if (d.data.code == 200) {
            if(d.data.data == null){
              that.setData({
                good_comment: ''
              })
              console.log(d.data.data + "书籍详情推优评论接口调取失败")
            }else{

            that.setData({
              good_comment: d.data.data
            })
            var cs = 'good_comment.dateline'
            // var cs = "good_comment[' + i + '].dateline"
            that.setData({
              [cs]: that.timestampToTime(that.data.good_comment.dateline)
            })
            console.log(that.data.good_comment)


            console.log(d.data.msg + "书籍详情推优评论接口调取成功")
            }
          } else {
            that.setData({
              good_comment: ''
            })
            console.log(d.data.msg + "书籍详情推优评论接口调取失败")
          }


        })

        var params = {
          "bid": d.data.data.id,
        }
        console.log(params)
        app.dsh.record(params).then(d => {
          if (d.data.code == 200) {

            that.setData({
              re_num: d.data.data.count
            })
            console.log(that.data.re_num)

            console.log(d.data.msg + "读书人数接口调取成功")
          } else {
            console.log(d.data.msg + "读书人数接口调取失败")
          }


        })


        var params = {

          "id": d.data.data.id,
        }
        console.log(params)
        app.dsh.book_detail_catelog(params).then(d => {
          if (d.data.code == 200) {

            that.setData({
              catelog: d.data.data.list
            })

            console.log(that.data.catelog)


            console.log(d.data.msg + "书籍详情目录接口调取成功")
          } else {
            console.log(d.data.msg + "书籍详情目录接口调取失败")
          }


        })
        console.log(d.data.msg + "书籍详情接口调取成功")
      } else {
        console.log(d.data.msg + "书籍详情接口调取失败")
      }


    })
  },

  getuserinfo: function (e) {
    let that = this
    var type = e.currentTarget.dataset.type
    wx.setStorageSync("type", type)
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
                      if(type == 3){
                        that.setData({ islogin: true, current: 1 })
                        wx.setStorageSync("islogin", that.data.islogin)
                      
                      } else if (type == 1){
                        that.setData({ islogin: true })
                        wx.setStorageSync("islogin", that.data.islogin)
                        that.onShow()
                        // that.go_read()
                      } else if (type == 2){
                        that.setData({ islogin: true })
                        wx.setStorageSync("islogin", that.data.islogin)
                        that.onShow()
                        that.add()
                      } else if (type == 4) {
                        that.setData({ islogin: true })
                        wx.setStorageSync("islogin", that.data.islogin)
                      
                      }
                        else {
                        that.setData({ islogin: true})
                      }
                      
                    } else {
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
  //加入书架
  add: function() {
    let that = this
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
      "bid": that.data.book_detail.id
    }
    console.log(params)
    app.dsh.add_mybook(params).then(d => {
      if (d.data.code == 200) {
        console.log(d.data.msg + "加入我的书籍接口调取成功")
        
        that.onShow()
      } else {
        wx.showToast({
          title: '这本书已经在书架了哦~',
          icon: 'none',
          duration: 2000
        })
        console.log(d.data.msg + "加入我的书籍接口调取失败")
      }


    })
    
  },
  go_read: function (e) {
    var chapterid = e.currentTarget.dataset.chapterid;
    console.log(chapterid + '===============chapter_content')
    wx.navigateTo({
      url: '/pages/read_detail/read_detail?chapterid=' + chapterid + '&bid=' + this.data.book_detail.id
    })
  },
  //更多评论
  go_more_comment: function () {
    wx.navigateTo({
      url: '/pages/more_comment/more_comment?id=' + this.data.book_detail.id
    })
  },
  //去阅读
  go_read: function(e) {
    var chapterid = e.currentTarget.dataset.chapterid;
    console.log(chapterid + '===============chapter_content')
    wx.navigateTo({
      url: '/pages/read_detail/read_detail?chapterid=' + chapterid + '&bid=' + this.data.book_detail.id
    })
  },
  //更多评论
  go_more_comment: function() {
    wx.navigateTo({
      url: '/pages/more_comment/more_comment?id=' + this.data.book_detail.id
    })
  },
  //点击星星评价
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    console.log(e.currentTarget.dataset.in);
    // console.log(e.currentTarget);
    var star_num;
      star_num = Number(e.currentTarget.id)
      console.log(star_num +"===========star_num")
    wx.navigateTo({
      url: '/pages/comment/comment?star_num=' + star_num + '&bid=' + this.data.book_detail.id
    })
  },

  //下方标题选择栏
  swichNav: function (e) {
    var that = this
    var cur = e.target.dataset.current;
    // var category_id = e.target.dataset.category_id
    if (that.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        current: cur
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    var token = wx.getStorageSync("token")
    that.get_book_detail(that.data.bid,token)
    var type = wx.getStorageSync("type")
    if(type == 1){
      wx.navigateTo({
        url: '/pages/read_detail/read_detail?chapterid=' + this.data.last_chapter + '&bid=' + this.data.book_detail.id
      })
      wx.setStorageSync("type", 0)
    }
    // wx.hideLoading()
    // that.onLoad()
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