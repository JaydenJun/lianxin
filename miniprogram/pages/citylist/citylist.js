// pages/citylist/citylist.js
const map = require('../../libs/map')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locsuccess: false,
    map: map,
    letter: 'A',
    cityname: '未选择'
  },
  tapletter(event) {
    let l = event.target.dataset.l
    this.setData({
      letter: l
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
          cityname: city,
          locsuccess: true
        })
      }
    })
  },
  tapcity(event) {
    let c = event.target.dataset.c
    if (c == undefined) {
      return;
    }
    getApp().globalData.cityname = c
    wx.navigateBack()
  },
  taploccity(event) {
    if (this.data.locsuccess) {
      getApp().globalData.cityname = this.data.cityname
      wx.navigateBack()
    } else {
      console.log('自动定位失败，弹窗提示')
      wx.showModal({
        title: '提示',
        content: '是否跳转到设置，重新赋予定位权限',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting({
              success: (settingres) => {
                console.log('设置结果', settingres)
                if (settingres.authSetting['scope.userLocation']) {
                  this.getLocation()
                }
              }
            })
          }
        },
        fail: (err) => (console.warn(err))
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})