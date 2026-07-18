Page({
  data: {
    days: [
      { date: '05.12', done: true }, { date: '05.13', done: true },
      { date: '05.14', done: true }, { date: '05.15', done: true },
      { date: '05.16', done: true }, { date: '今天', done: true, today: true },
      { date: '05.18', done: false }
    ],
    learned: 18, goal: 20, percent: 90
  },
  onReady() {
    this.ringReady = true
    this.drawProgressRing()
  },
  drawProgressRing() {
    if (!this.ringReady) return

    this.createSelectorQuery()
      .select('.progress-ring-canvas')
      .fields({ node: true, size: true })
      .exec(([result]) => {
        if (!result || !result.node) return

        const canvas = result.node
        const context = canvas.getContext('2d')
        const pixelRatio = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : wx.getSystemInfoSync().pixelRatio
        const size = Math.min(result.width, result.height)
        const center = size / 2
        const lineWidth = size * 0.058
        const radius = center - lineWidth / 2
        const startAngle = -Math.PI / 2
        const progress = Math.max(0, Math.min(1, this.data.percent / 100))

        canvas.width = Math.round(size * pixelRatio)
        canvas.height = Math.round(size * pixelRatio)
        context.scale(pixelRatio, pixelRatio)
        context.clearRect(0, 0, size, size)
        context.lineWidth = lineWidth
        context.lineCap = 'round'

        context.beginPath()
        context.strokeStyle = '#dcebe1'
        context.arc(center, center, radius, 0, Math.PI * 2)
        context.stroke()

        if (progress > 0) {
          context.beginPath()
          context.strokeStyle = '#0a7c49'
          context.arc(center, center, radius, startAngle, startAngle + Math.PI * 2 * progress)
          context.stroke()
        }
      })
  },
  startStudy() { wx.navigateTo({ url: '/pages/study/study' }) },
  openReport() { wx.navigateTo({ url: '/pages/report/report' }) },
  openLibrary() { wx.showToast({ title: '词库正在整理中', icon: 'none' }) },
  editGoal() {
    wx.showModal({ title: '修改每日目标', editable: true, placeholderText: '请输入 5-100 的数字', success: ({ confirm, content }) => {
      const goal = Number(content)
      if (confirm && goal >= 5 && goal <= 100) {
        this.setData({ goal, percent: Math.min(100, Math.round(this.data.learned / goal * 100)) }, () => this.drawProgressRing())
      } else if (confirm) {
        wx.showToast({ title: '请输入 5–100 的数字', icon: 'none' })
      }
    } })
  }
})
