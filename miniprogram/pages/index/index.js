// index.js
Page({

  data: {
    movielist: [], // 保存当前页面中显示的电影列表
    active: '1', // 用于描述当前导航选中项的类别ID
    cityname: ''
  },

  /** 当点击顶部导航选项时 */
  tapNav(event) {
    let id = event.target.dataset.id // 获取data-id参数
    // 别急着发请求，先去缓存中找找，看有没有存过
    wx.getStorage({
      key: id,
      success: (res) => { // 如果读到了, 直接更新UI
        console.log('读取缓存数据：', res)
        this.setData({
          movielist: res.data,
          active: id
        })
      },
      fail: (err) => { // 如果没读到数据，重新发送请求，且将数据缓存下来
        console.log('读取缓存失败：', err)

        // 发送https请求, 访问当前类别下的电影列表
        this.loadData(id, 0).then(newlist => {
          console.log('切换选项卡:', newlist);
          this.setData({
            movielist: newlist,
            active: id
          })
          // 列表更新后，将该类别的电影列表存入Storage缓存
          // 将  id与newlist 配对， 存入缓存
          wx.setStorage({
            key: id,
            data: newlist
          })
        })
      }
    })

  },

  /**
   * 通过 类别ID 与 起始下标位置 查询相应类别下的电影列表
   * @param {number} cid   类别ID
   * @param {number} offset  起始下标位置
   * @returns {Promise} 返回电影列表
   */
  loadData(cid, offset) {
    return new Promise((resolve, reject) => {

      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {
          cid,
          offset
        },
        success: (res) => {
          resolve(res.data) // 将res中的电影列表返回给Promise的持有者
        },
        fail: (err) => {
          reject(err) // 将错误消息返回给Promise的持有者
        },
        complete: (msg) => { // 无论成功或失败都执行
          wx.hideLoading()
        }
      })
    })
  },

  getLocation() {
    let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
    let qqmapsdk = new QQMapWX({
      key: 'IW3BZ-MI2CV-GBFP4-UWMAL-S6EVK-NQFDI'
    })
    // 调用接口
    qqmapsdk.reverseGeocoder({
      success: (res) => {
        let city = res.result.address_component.city
        console.log('当前位置信息', city);
        this.setData({
          cityname: city
        })
        getApp().globalData.cityname = city
      }
    })
  },

  /** 页面加载时执行 */
  onLoad() {
    this.getLocation()
    this.loadData(1, 0).then(newlist => {
      console.log('加载首页电影列表', newlist);
      this.setData({
        movielist: newlist
      })
    })
  },
  onShow() {
    let cityname = getApp().globalData.cityname
    this.setData({
      cityname
    })
  },
  /** 当前页滚动到底后触发 */
  onReachBottom() {
    console.log('到底了!!!');
    // 发送https请求, 访问当前类别的下一页电影列表
    let cid = this.data.active
    let offset = this.data.movielist.length
    //调用loadData， 加载电影列表
    this.loadData(cid, offset).then(newlist => {
      // 将newlist，追加到data.movielist的末尾
      this.setData({
        movielist: this.data.movielist.concat(newlist)
      })
    })
  },
  /** 监听下拉刷新 */
  onPullDownRefresh() {
    console.log("this.onPullDownRefresh")
    //发送https请求， 访问当前类别下的第一页电影数据
    let cid = this.data.active
    let offset = 0
    this.loadData(cid, offset).then(newlist => {
      this.setData({
        movielist: newlist
      })
      // 手动停止下拉刷新动画
      wx.stopPullDownRefresh()
      // 一旦拿到响应，要更新缓存(把最新列表数据存一遍)
      wx.setStorage({
        key: cid,
        data: newlist
      })

    })
  }
})