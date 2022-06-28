// components/mybutton/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    round: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#1989fa'
    },
    title: {
      type: String,
      value: '默认文本'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lastTime: 0 // 描述上次点击时的时间戳
  },

  /** 组件的方法列表 */
  methods: {
    tapEvent() {
      // 判断与上次点击的时间相差多少
      // 如果小于350毫秒，那么就主动触发自定义事件：doubletap
      let now = new Date().getTime()
      if (now - this.data.lastTime < 350) { // 满足了条件
        // 主动触发自定义事件 doubletap
        this.triggerEvent('doubletap')
        now = 0
      }
      this.data.lastTime = now
    }
  }
})