const { calculateStreak, dateKey, recentDateKeys } = require('../../utils/progress')

const app = getApp()

Page({
  data: {
    days: [], learned: 0, goal: 20, percent: 0, streak: 0
  },
  onReady() {
    this.ringReady = true
    this.drawProgressRing()
  },
  async onShow() {
    await app.globalData.ready
    this.refresh()
  },
  refresh() {
    const progress = app.getProgress()
    const today = dateKey()
    const learned = progress.dailyCounts[today] || 0
    const days = recentDateKeys().map((key) => ({
      date: key === today ? '今天' : key.slice(5).replace('-', '.'),
      done: (progress.dailyCounts[key] || 0) > 0,
      today: key === today
    }))
    this.setData({
      days,
      learned,
      goal: progress.dailyGoal,
      percent: Math.min(100, Math.round(learned / progress.dailyGoal * 100)),
      streak: calculateStreak(progress.dailyCounts)
    }, () => this.drawProgressRing())
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
  openQuiz() { wx.navigateTo({ url: '/pages/quiz/quiz' }) },
  openReport() { wx.navigateTo({ url: '/pages/report/report' }) },
  openLibrary() { wx.showToast({ title: '词库正在整理中', icon: 'none' }) },
  editGoal() {
    wx.showModal({ title: '修改每日目标', editable: true, placeholderText: '请输入 5-100 的数字', success: ({ confirm, content }) => {
      const goal = Number(content)
      if (confirm && goal >= 5 && goal <= 100) {
        app.saveProgress({ dailyGoal: goal })
        this.refresh()
      } else if (confirm) {
        wx.showToast({ title: '请输入 5–100 的数字', icon: 'none' })
      }
    } })
  }
})
