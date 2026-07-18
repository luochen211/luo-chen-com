const { STORAGE_KEY, normalizeProgress } = require('./utils/progress')

App({
  onLaunch() {
    this.globalData.progress = normalizeProgress(wx.getStorageSync(STORAGE_KEY))
    this.globalData.ready = this.syncProgress()
  },

  globalData: { progress: null, ready: Promise.resolve() },

  getProgress() {
    return this.globalData.progress
  },

  saveProgress(change) {
    const progress = normalizeProgress(this.globalData.progress)
    if (typeof change === 'function') change(progress)
    else Object.assign(progress, change)
    progress.updatedAt = Date.now()
    this.globalData.progress = progress
    wx.setStorageSync(STORAGE_KEY, progress)
    clearTimeout(this.syncTimer)
    this.syncTimer = setTimeout(() => this.syncProgress(), 400)
    return progress
  },

  async syncProgress() {
    if (!wx.cloud || !wx.cloud.callFunction) return this.globalData.progress
    try {
      if (!this.cloudInitialized) {
        wx.cloud.init({ traceUser: true })
        this.cloudInitialized = true
      }
      const { result } = await wx.cloud.callFunction({
        name: 'syncProgress',
        data: { progress: this.globalData.progress }
      })
      if (result && result.progress && result.progress.updatedAt >= this.globalData.progress.updatedAt) {
        this.globalData.progress = normalizeProgress(result.progress)
        wx.setStorageSync(STORAGE_KEY, this.globalData.progress)
      }
    } catch (error) {
      console.info('云端同步暂不可用，已保存在本机', error.errMsg || error.message)
    }
    return this.globalData.progress
  }
})
