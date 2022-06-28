// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: { // 绑定用户基本信息
      avatarUrl: '',
      nickName: '点击登录'
    },
    isLogin: false, // 绑定用户是否已经登录
  },

  /** 点击头像，修改头像 */
  tapAvatar() {
    if (!this.data.isLogin) { // 如果没有登录，点击直接return
      return;
    }
    // 选择图片 
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        console.log('选择图片：', res)
        let path = res.tempFiles[0].tempFilePath
        let userInfo = this.data.userInfo
        userInfo.avatarUrl = path
        this.setData({
          userInfo
        })
        // 将文件上传至云存储
        this.upload(path)
      }
    })
  },

  /** 将path指向的文件上传至云存储 */
  upload(path) {
    // 把path的文件后缀，截取出来，作为新文件名的后缀
    let ext = path.substring(path.lastIndexOf('.'))
    let cPath = 'img_' + Math.random() + ext
    wx.cloud.uploadFile({
      filePath: path,
      cloudPath: cPath,
      success: (res) => {
        console.log('上传结果:', res)
        let fileID = res.fileID // 云存储将返回图片的链接
        // 修改数据库中用户的avatarUrl字段
        this.updateUserAvatar(fileID)
      }
    })
  },

  /** 修改数据库中用户的avatarUrl字段 修改为云存储中图片路径 */
  updateUserAvatar(fileID) {
    // 通过 _id 找到当前用户，修改用户的avatarUrl
    let db = wx.cloud.database()
    let _id = this.data.userInfo._id // 获取用户的 _id
    db.collection('users').doc(_id).update({
      data: {
        avatarUrl: fileID
      },
      success: (res) => {
        console.log('修改头像：', res)
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
      }
    })
  },

  /** 点击登录 */
  tapLogin() {
    if (this.data.isLogin) { // 如果已经登录，则直接return
      return;
    }
    wx.getUserProfile({
      desc: '获取用户信息以维护会员权益',
      success: (res) => {
        console.log('点击登录获取用户基本信息', res)
        // 将用户信息userInfo存入data
        this.setData({
          userInfo: res.userInfo,
          isLogin: true //修改状态：已登录
        })

        // 去自己家云数据库users集合中找找，当前用户是否登录过
        let db = wx.cloud.database()
        db.collection('users').get().then(queryRes => {
          console.log('查询当前用户信息：', queryRes)
          if (queryRes.data.length == 0) {
            // 如果没有登录过，则注册
            this.regist(res.userInfo)
          } else {
            // 如果登录过，则直接显示数据库中的数据
            let userInfo = queryRes.data[0]
            this.setData({
              userInfo
            })
          }
        })
      }
    })
  },

  /** 将当前用户信息，注册到云数据库user集合 */
  regist(userInfo) {
    let db = wx.cloud.database()
    db.collection('users').add({
      data: userInfo,
      success: (res) => {
        console.log('注册用户', res)
      }
    })
  },

  doubleTapEvent() { // 当双击按钮后执行
    console.log('触发双击，么么哒...')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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