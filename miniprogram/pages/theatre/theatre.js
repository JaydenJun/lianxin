// pages/theatre/theatre.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityname: '未选择',
    theatrelist: [],
  },
  tapitem(event) {
    console.log(event.currentTarget.dataset.i)
    let i = event.currentTarget.dataset.i
    let t = this.data.theatrelist[i]
    wx.openLocation({
      latitude: t.location.lat,
      longitude: t.location.lng,
      name: t.title,
      address: t.address,
      scale: 15
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  onShow() {
    this.setData({
      cityname: getApp().globalData.cityname
    })
    let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
    let qqmapsdk = new QQMapWX({
      key: 'IW3BZ-MI2CV-GBFP4-UWMAL-S6EVK-NQFDI'
    })
    qqmapsdk.search({
      keyword: '影院',
      page_size: 20,
      region: getApp().globalData.cityname,
      success: (res) => {
        console.log('影院列表:', res)
        res.data.forEach(item => {
          item._disstr = (item._distance / 1000).toFixed(2)
        })
        this.setData({
          theatrelist: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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