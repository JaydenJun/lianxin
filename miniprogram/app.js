// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'lianxin-7geafmyzf228d571'
    })
  },
  globalData: {
    cityname: '未选择',
  }
})