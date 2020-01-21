// pages/wenzhang_detail/wenzhang_detail.js
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
    scrollTop: 0
  },

  // onPageScroll: function (e) {
  //   let that = this
  //   console.log(e);//{scrollTop:99}
  //   that.setData({
  //     scrollTop: e.scrollTop
  //   })
  // },

  bindscroll:function(e){
    let that = this
    console.log(e.detail.scrollTop + '===========================event.detail.scrollTop')
    that.setData({ scrollTop1: e.detail.scrollTop})
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    var token = wx.getStorageSync("token")
    var id = options.id
    that.setData({bid:id})
    
    var params = {
      "token": wx.getStorageSync("token"),
      "nid": that.data.bid,
      
    }
    

    var timestamp = Date.parse(new Date()) / 1000;           
    //当前时间戳
    console.log(timestamp + "===========================timestamp")

    var year_week = wx.getStorageSync("year_week")         //本周是今年的第几周
    console.log(year_week + '============read_detail.year_week')
    var btn = 1

    that.set_read_time(token, year_week, timestamp, btn)  //设置阅读时长

    

    var params = {
      "id": id,
    }
    console.log(params)
    app.dsh.get_wenzhang(params).then(d => {
      if (d.data.code == 200) {
        that.setData({ 
          wz_content: d.data.data,
          wswz: d.data.data.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"')
        })
        console.log(d.data.data)
        var fg = 'wz_content.mediaurl'
        that.setData({
          [fg]: that.data.wz_content.mediaurl.split(",")
        })
        
        for (let i = 0; i < that.data.wz_content.mediaurl.length; i++){
          if (that.data.wz_content.mediaurl[i].indexOf(".mp3") >= 0) {
            var mp3url = 'wz_content.mp3url'
            that.setData({
              mp3url: that.data.wz_content.mediaurl[i],
              mp3: true
            })
          }
          else if (that.data.wz_content.mediaurl[i].indexOf(".mp4") >= 0) {
            var mp4url = 'wz_content.mp4url'
            that.setData({
              mp4url: that.data.wz_content.mediaurl[i],
              mp4: true
            })
          }
        }
        
        var cs = 'wz_content.dateline'
        // var cs = "wz_content[' + i + '].dateline"

        var params = {
          "id": id
        }
        app.dsh.relation(params).then(d => {
          if (d.data.code == 200) {
            that.setData({
              relation: d.data.data
            })
            // if (that.data.relation != ''){
            //   var query = wx.createSelectorQuery();
            //   query.select('.cont_').boundingClientRect(function (rect) {

            //     that.setData({
            //       cont_height: rect.height
            //     })
            //     var height = that.data.rich_text_height + that.data.message_layout_height + rect.height + 550
            //     that.setData({
            //     height: height
            //   })
            //     console.log(height + '========================height')
            //     console.log(that.data.cont_height + "===================cont_height")
            //   }).exec();
              
            // }
            // else{
            //   that.setData({
            //     cont_height: 0
            //   })
            //   var height = that.data.rich_text_height + that.data.message_layout_height + that.data.cont_height + 550 
            //   that.setData({
            //     height: height
            //   })
            // }
            
            console.log(d.data.msg + "关联文章继续阅读接口调取成功")
          }
          else {
            console.log(d.data.msg + "关联文章继续阅读接口调取失败")
          }
        })

        var params = {
          "token": token,
          "nid": id,
        }
        console.log(params)
        app.dsh.get_message(params).then(d => {
          if (d.data.code == 200) {
            that.setData({ get_message: d.data.data })

            // if(that.data.get_message != ''){
            //   var query = wx.createSelectorQuery();
            //   query.select('.message_layout').boundingClientRect(function (rect) {

            //     that.setData({
            //       message_layout_height: rect.height
            //     })
            //     var height = that.data.rich_text_height + that.data.message_layout_height + rect.height + 550
            //     that.setData({
            //       height: height
            //     })
            //     console.log(that.data.message_layout_height + "===================message_layout_height")
            //   }).exec();
            // }
            // else {
            //   that.setData({
            //     message_layout_height: 0
            //   })
            //   var height = that.data.rich_text_height + that.data.message_layout_height + rect.height + 550
            //   that.setData({
            //     height: height
            //   })
            // }
            
            console.log(d.data.msg + "获取留言接口调取成功")
          } else {
            // that.setData({
            //   message_layout_height: 0
            // })
            console.log(d.data.msg + "获取留言接口调取失败")
          }
        })

        // if(that.data.wz_content.content != ''){
        //   var query = wx.createSelectorQuery();
        //   query.select('.rich_text').boundingClientRect(function (rect) {

        //     that.setData({
        //       rich_text_height: rect.height
        //     })
        //     var height = that.data.rich_text_height + that.data.message_layout_height + rect.height + 550
        //     that.setData({
        //       height: height
        //     })
        //     console.log(that.data.rich_text_height + "===================rect.height")
        //   }).exec();
        // }
        // else{
        //   that.setData({
        //     rich_text_height: 0
        //   })
        //   var height = that.data.rich_text_height + that.data.message_layout_height + rect.height + 550
        //   that.setData({
        //     height: height
        //   })
        // }


        
       
        
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

        that.setData({
          [cs]: that.timestampToTime(that.data.wz_content.dateline)
        })
        that.initialization();
       
        console.log(d.data.msg + "获取文章详情接口调取成功")
      } else {
        console.log(d.data.msg + "获取文章详情接口调取失败")
      }
    })
    

    
    
  },

  //设置阅读时长
  set_read_time: function (token, year_week, timestamp, btn) {

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
    //获取播放状态和当前播放时间
    var isplay = this.data.isplay;
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({ isplay: !isplay })
    if (isplay) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({ audioSeek: innerAudioContext.currentTime });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = this.data.mp3url;
      if (innerAudioContext.duration != 0) {
        this.setData({ audioDuration: innerAudioContext.duration });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },
  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
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



 //写留言
  edit_message: function(e) {
    let that = this
    var content = e.detail.value

    console.log(content.length + '++++++++++++++++length')
    if (content.length >= 500) {
      wx.showToast({
        title: '留言不能超过500字哦~',
        icon: 'none',
        duration: 2000
      })
      if (content.length == 500) {
        that.setData({
          content: content
        })
        console.log(that.data.content + '++++++++++500')
      }
    }
    else {
      that.setData({
        content: content
      })
      console.log(that.data.content)
    }

  },
  //发表留言
  post_message: function() {
    let that = this
    var token = wx.getStorageSync("token")
    var params = {
      "token": token,
      "nid": that.data.bid,
      "content": that.data.content
    }
    console.log(params)
    app.dsh.post_message(params).then(d => {
      if(d.data.code == 200){
        wx.showToast({
          title: '留言成功',
          icon: 'succeed',
          duration: 2000
        })
        var params = {
          "token": token,
          "nid": that.data.bid,
        }
        console.log(params)
        app.dsh.get_message(params).then(d => {
          if (d.data.code == 200) {
            that.setData({ get_message: d.data.data })
            console.log(d.data.msg + "获取留言接口调取成功")
          } else {
            console.log(d.data.msg + "获取留言接口调取失败")
          }
        })
        that.setData({ content: ''})
        console.log(d.data.msg + "发表留言接口调取成功")
      }else{
        console.log(d.data.msg + "发表留言接口调取失败")
      }
      

    })
  },

  //时间戳转换为标准时间
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    var D = date.getDate() + '日';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return M + D;
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
    let that = this
    this.loadaudio();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "nid": that.data.bid,

      "position": that.data.scrollTop1
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    innerAudioContext.pause();
    //更改播放状态
    this.setData({ 
      isplay: false,
      audioSeek: innerAudioContext.currentTime
     })

    
    var params = {
      "token": wx.getStorageSync("token"),
      "nid": that.data.bid,
      
      "position": that.data.scrollTop1
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
    
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);

    var timestamp = Date.parse(new Date()) / 1000;
    console.log(timestamp + "===========================timestamp")
    var year_week = wx.getStorageSync("year_week")
    console.log(year_week + '============read_detail.year_week')
    var btn = 2
    var token = wx.getStorageSync('token')

    this.set_read_time(token, year_week, timestamp, btn)

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

  cont_cump:function(e){
    var nid = e.currentTarget.dataset.nid
    var bid = e.currentTarget.dataset.bid
    console.log(nid + '=============bid')
    console.log(bid + '=============bid')
    
    if(nid){
      wx.navigateTo({
      url: '/pages/wenzhang_detail/wenzhang_detail?id=' + nid               //?star_num=' + star_num
    })
    }else if(bid){
      wx.navigateTo({
        url: '/pages/book_detail/book_detail?bid=' + bid
       })
     }else{
        console.log("继续阅读关联出错")
    }
    
  },
})