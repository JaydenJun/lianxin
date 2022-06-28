// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: null, // 绑定当前电影详情信息
    isOpen: false, // 用于表示是否展开电影描述信息
    comments: [], // 用于保存评论数组
  },

  /** 点击剧照图片 */
  tapThumb(event) {
    let i = event.target.dataset.i // 获取data-i参数值
    if (i == undefined) {
      return; // 如果没有点到图片，方法结束
    }
    let urls = this.data.movie.thumb
    let newurls = []
    urls.forEach(url => {
      newurls.push(
        url.substring(0, url.lastIndexOf('@'))
      )
    })
    wx.previewImage({
      urls: newurls,
      current: newurls[i] // 当前正在显示的图片链接
    })
  },

  /** 点击简介，切换展开与收起的状态 */
  tapIntro() {
    this.setData({
      isOpen: !this.data.isOpen
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // options可以接收首页传过来的电影ID
    let id = options.id
    // 发送请求，获取详细信息
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      method: 'GET',
      data: {
        id: id
      },
      success: (res) => {
        console.log('加载详情：', res)
        // 将 res.data 存入 this.data.movie中
        this.setData({
          movie: res.data
        })
      }
    })

    // 加载当前电影的评论列表
    let db = wx.cloud.database()
    db.collection('comments').where({
      movieid: id
    }).skip(0).limit(5).get().then(res => {
      console.log('查询评论列表：', res)
      this.setData({
        comments: res.data
      })
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