Component({
  properties: { title: String, back: Boolean, action: String },
  methods: {
    goBack() { wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/home/home' }) }) },
    tapAction() { this.triggerEvent('action') }
  }
})
