const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0,
    menu: false,
    // num: 0,
    catalog: [],
    
    scrollTop: 0,
    
  },

  bindscroll: function (e) {
    let that = this
    console.log(e.detail.scrollTop + '===========================event.detail.scrollTop')
    that.setData({ scrollTop1: e.detail.scrollTop })

  },
  
  onPageScroll: function (e) {
    let that = this
    console.log(e);//{scrollTop:99}
          that.setData({
            scrollTop: e.scrollTop
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var token = wx.getStorageSync("token")

    var chapterid = options.chapterid
    var bid = options.bid
    that.setData({
      bid:bid,
    })

    var timestamp = Date.parse(new Date()) / 1000;
    console.log(timestamp + "===========================timestamp")
    
    var year_week = wx.getStorageSync("year_week")
    console.log(year_week + '============read_detail.year_week')
    var btn = 1

    var params = {
      "token": token,
      "bid": that.data.bid,
      "id": chapterid,

    }
    console.log(params)
    app.dsh.getchapterprenext(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          sxz: d.data.data
        })
        console.log(d.data.msg + "上下章节返回调取成功")
      } else {
        console.log(d.data.msg + "上下章节返回调取失败")
      }
    })
    

    that.set_read_time(token, year_week, timestamp,btn)

    that.getcontent(token,chapterid,bid)

    that.getchapter(chapterid, bid)


    this.loadaudio();

  },

  getchapter: function (chapterid, bid){
    let that = this
    var params = {
      "id": bid,
    }
    console.log(params)
    app.dsh.book_detail_catelog(params).then(d => {
      if (d.data.code == 200) {

        that.setData({
          catalog: d.data.data.list
        })

        for (let i = 0; i < that.data.catalog.length; i++) {
          console.log("zhengzaiyuedu " + i)
          if (chapterid == that.data.catalog[i].id) {
            var cur = "catalog[" + i + "].cur_read"
            that.setData({
              [cur]: true
            })
          }
          else {
            var cur = "catalog[" + i + "].cur_read"
            that.setData({
              [cur]: false
            })
          }
        }

        console.log(that.data.catalog)
        console.log(d.data.msg + "书籍详情目录接口调取成功")
      } else {
        console.log(d.data.msg + "书籍详情目录接口调取失败")
      }

    })

  },


  getcontent: function(token,chapterid,bid){
    let that = this
    var params = {
      "token": token,
      "id": chapterid,
      "bid": bid
    }
    app.dsh.read_detail(params).then(d => {
      if (d.data.code == 200) {
        that.setData({ 
          chapter_content: d.data.data,
          // wscs: d.data.data.content
           wscs: d.data.data.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"')
         })
        // that.setData({
          
        //   wscs: that.data.wss.replace(/<img[^>]*>/gi, function (match, capture) {
           
        //     return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;display:block"') // 替换style

        //   })
        // })
       
        

          

      
        var fg = 'chapter_content.mediaurl'
        that.setData({
          [fg]: that.data.chapter_content.mediaurl.split(",")
        })
        console.log(d.data.data)
        

        for (let i = 0; i < that.data.chapter_content.mediaurl.length; i++) {
          if (that.data.chapter_content.mediaurl[i].indexOf(".mp3") >= 0) {
            var mp3url = 'chapter_content.mp3url'
            that.setData({
              mp3url: that.data.chapter_content.mediaurl[i],
              mp3: true
            })
          }
          else if (that.data.chapter_content.mediaurl[i].indexOf(".mp4") >= 0) {
            var mp4url = 'chapter_content.mp4url'
            that.setData({
              mp4url: that.data.chapter_content.mediaurl[i],
              mp4: true
            })
          }
        }
        that.initialization();
        
          var cs = 'chapter_content.dateline'
          that.setData({
            [cs]: that.timestampToTime(that.data.chapter_content.dateline)
          })
          
        

        console.log(that.data.chapter_content.dateline)
        
        // var query = wx.createSelectorQuery();
        // query.select('.rich_text').boundingClientRect(function (rect) {
          
        //   that.setData({
        //     height: rect.height + 300
        //   })
        //   console.log(that.data.height + "===================rect.height")
        // }).exec();



        var params = {
          "token": wx.getStorageSync("token"),
          "bid": that.data.bid,
          "chapter_id": chapterid,
        }
        app.dsh.getposition(params).then(d => {
          console.log(d)
          if (d.data.code == 200) {
            that.setData({ scrollTop: d.data.data.position })
            // wx.pageScrollTo({
            //   scrollTop: that.data.scrollTop,

            //   success: () => {
            //     console.log("页面滚动成功")
            //   },
            //   fail: () => {
            //     console.log("页面滚动失败")
            //   },
            // })

            console.log(d.data.msg + '============阅读位置获取成功')
          } else {
            console.log(d.data.msg + '============阅读位置获取失败')
            // console.log("接口错误")
          }
        })

        
     
        console.log(d.data.msg + "章节阅读详情接口调取成功")
      } else {
        console.log(d.data.msg + "章节阅读详情接口调取失败")
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

  menu: function() {
    this.setData({
      menu: true
    })
    console.log(this.data.menu + "目录")
  },

  back: function () {
    this.setData({
      menu: false
    })
  },

  menu_select:function(e){
    let that = this
    var token = wx.getStorageSync("token")
    var chapterid = e.currentTarget.dataset.chapterid
    // that.getcontent(token, chapterid, that.data.bid)
    // that.getchapter(chapterid, that.data.bid)
    innerAudioContext.pause()
    that.setData({
      isplay: false,
      audioSeek: innerAudioContext.currentTime
    })

    wx.redirectTo({
      url: '/pages/read_detail/read_detail?chapterid=' + chapterid + '&bid=' + that.data.bid
    })

    // that.setData({
    //   menu: false
    // })

  },

  cump:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type)

    var token = wx.getStorageSync('token')

    var params = {
      "token": token,
      "bid": this.data.chapter_content.bid,
      "queue": this.data.chapter_content.queue,
    }
    console.log(params)
    app.dsh.getchapterprenext(params).then(d => {
      if (d.data.code == 200) {
        that.setData({
          sxz: d.data.data
        })
        
        if(type == 1){
          if (that.data.sxz.preid == null) {
            wx.showToast({
              title: '已经是第一章了哦',
              icon: 'none',
              duration: 1500
            })
            console.log(that.data.sxz.preid + "上下章章节阅读详情接口调取失败")
          }else{
            innerAudioContext.pause()
            that.setData({ 
              isplay: false,
              audioSeek: innerAudioContext.currentTime})

            wx.navigateTo({
              url: '/pages/read_detail/read_detail?chapterid=' + that.data.sxz.preid + '&bid=' + that.data.bid
            })

           
            
          }


          
          
        } else if (type == 2){
          if (that.data.sxz.nextid == null) {
            wx.showToast({
              title: '已经是最后一章了哦',
              icon: 'none',
              duration: 1500
            })
            console.log(that.data.sxz.nextid + "上下章章节阅读详情接口调取失败")
          } else {
            innerAudioContext.pause()
            that.setData({
              isplay: false,
              audioSeek: innerAudioContext.currentTime
            })

            innerAudioContext.pause()
            that.setData({
              isplay: false,
              audioSeek: innerAudioContext.currentTime
            })

            wx.redirectTo({
              url: '/pages/read_detail/read_detail?chapterid=' + that.data.sxz.nextid + '&bid=' + that.data.bid
            })

          
          }
        }
        // console.log(d.data.msg + "上下章节返回调取成功")
      } else {
        console.log(d.data.msg + "上下章上下章节返回调取失败")
      }
    })

  },


  preventTouchMove() { return },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "bid": that.data.bid,
      "chapter_id": that.data.chapter_content.id,
      "position": that.data.scrollTop
    }
    app.dsh.setposition(params).then(d => {
      console.log(d)
      if (d.data.code == 200) {
        
        console.log(d.data.msg + '============阅读位置返回成功')
      } else {
        console.log(d.data.msg + '============阅读位置返回失败')
        // console.log("接口错误")
      }
    })
  },

  set_read_time: function (token, year_week, timestamp,btn){
    
    var params = {
      "token": token,
      "week": year_week,
      "dateline": timestamp,
      "btn": btn
    }
    app.dsh.post_readtime(params).then(d => {
      console.log(d)
      if (d.data.code == 200) {
        this.setData({
          num: 0
        })
        console.log(d.data.msg + '============阅读时间返回成功')
      } else {
        console.log(d.data.msg + '============阅读时间返回失败')
        // console.log("接口错误")
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    innerAudioContext.stop();
    //更改播放状态
    that.setData({
      isplay: false,
      audioSeek: innerAudioContext.currentTime
    })
    clearInterval(that.data.durationIntval);
    var timestamp = Date.parse(new Date()) / 1000;
    console.log(timestamp + "===========================timestamp")
    var year_week = wx.getStorageSync("year_week")
    console.log(year_week + '============read_detail.year_week')
    var btn = 2
    var token = wx.getStorageSync('token')

    that.set_read_time(token, year_week, timestamp,btn)
    
    //阅读章节返回
    var params = {
      "token": token,
      "bid": that.data.chapter_content.bid,
      "chapterid": that.data.chapter_content.id,
      
    }
    console.log(params)
    app.dsh.post_readchapter(params).then(d => {
      if (d.data.code == 200) {

        console.log(d.data.msg + "书籍阅读章节返回调取成功")
      } else {
        console.log(d.data.msg + "书籍阅读章节返回调取失败")
      }
    })

    
    var params = {
      "token": wx.getStorageSync("token"),
      "bid": that.data.bid,
      "chapter_id": that.data.chapter_content.id,
      "position": that.data.scrollTop
    }
    app.dsh.setposition(params).then(d => {
      console.log(d)
      if (d.data.code == 200) {


        console.log(d.data.msg + '============阅读位置返回成功')
      } else {
        console.log(d.data.msg + '============阅读位置返回失败')
        // console.log("接口错误")
      }
    })
      //  wx.navigateBack({
      //   delta: 1
      // })
    
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

  },

  initialization() {
    var t = this;
    if (t.data.mp3url) {
      //设置src
      innerAudioContext.src = t.data.mp3url;
      //运行一次
      innerAudioContext.play();
      innerAudioContext.pause();
      innerAudioContext.onCanplay(() => {
        //初始化duration
        innerAudioContext.duration
        setTimeout(function () {
          //延时获取音频真正的duration
          var duration = innerAudioContext.duration;
          var min = parseInt(duration / 60);
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          t.setData({ audioDuration: innerAudioContext.duration, showTime2: `${min}:${sec}` });
        }, 1000)
      })
    }
  },
  //拖动进度条事件
  sliderChange(e) {
    var that = this;
    innerAudioContext.src = that.data.mp3url;

    //获取进度条百分比
    var value = e.detail.value;
    console.log(e.detail.value + '===================================e.detail.value;')
    that.setData({ audioTime: value });
    var duration = that.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    that.setData({ audioSeek: value, isPlayAudio: true });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },

  //播放、暂停按钮
  playAudio() {
    let that = this
    //获取播放状态和当前播放时间
    var isplay = that.data.isplay;
    var seek = that.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    that.setData({ isplay: !isplay })
    console.log(innerAudioContext.currentTime + '==========================innerAudioContext.currentTime')
    if (isplay) {
      //如果在播放则记录播放的时间seek，暂停
      that.setData({ audioSeek: innerAudioContext.currentTime });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = that.data.mp3url;
      if (innerAudioContext.duration != 0) {
        that.setData({ audioDuration: innerAudioContext.duration });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },
  loadaudio() {
    var that = this;
    //设置一个计步器
    that.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isplay == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration;
        console.log(duration + '============================duration')
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({ audioSeek: 0, audioTime: 0, audioDuration: duration, isplay: false, showTime1: `00:00` });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({ audioSeek: seek + 1, audioTime: time, audioDuration: duration, showTime1: `${min}:${sec}`, showTime2: `${min1}:${sec1}` });
      }
    }, 1000);
  },

  onReady: function () {
    this.animation = wx.createAnimation()
  },

  translate: function () {
    var rpx;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        rpx = res.windowWidth / 375
      },
    })
    this.setData({
      isRuleTrue: true,
      menu: true
    })
    this.animation.translate(249*rpx, -1*rpx).step()
    this.setData({ animation: this.animation.export() })
  },

  success: function () {
    var rpx;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        rpx = res.windowWidth / 375
      },
    })
    this.setData({
      isRuleTrue: true,
      menu:false
    })
    this.animation.translate(-200*rpx, 0*rpx).step()
    this.setData({ animation: this.animation.export() })
  },
  tryDriver: function () {
    this.setData({
      background: "#89dcf8"
    })
  }


})