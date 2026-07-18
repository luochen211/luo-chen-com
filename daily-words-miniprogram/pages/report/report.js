const { calculateStreak, recentDateKeys } = require('../../utils/progress')
const app = getApp()

Page({
  data: {
    bars: [], stats: [], dateRange: ''
  },
  async onShow() {
    await app.globalData.ready
    const progress = app.getProgress()
    const keys = recentDateKeys()
    const values = keys.map((key) => progress.dailyCounts[key] || 0)
    const max = Math.max(...values, 1)
    const weekQuiz = progress.quizRecords.filter((record) => keys.includes(record.date))
    const correct = weekQuiz.filter((record) => record.correct).length
    const accuracy = weekQuiz.length ? Math.round(correct / weekQuiz.length * 100) : 0
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    this.setData({
      dateRange: `${keys[0].slice(5).replace('-', '.')} - ${keys[6].slice(5).replace('-', '.')}`,
      bars: keys.map((key, index) => ({
        day: weekDays[new Date(`${key}T12:00:00`).getDay()],
        value: values[index],
        height: Math.max(8, Math.round(values[index] / max * 150))
      })),
      stats: [
        { icon: '/assets/icons/book.png', label: '已掌握', value: String(progress.learnedWords.length) },
        { icon: '/assets/icons/calendar.png', label: '待复习', value: String(new Set(progress.learningRecords.filter((record) => record.result === 'unknown').map((record) => record.wordId)).size) },
        { icon: '/assets/icons/target.png', label: '正确率', value: `${accuracy}%` },
        { icon: '/assets/icons/flame.png', label: '连续学习', value: `${calculateStreak(progress.dailyCounts)} 天` }
      ]
    })
  },
  share() { wx.showShareMenu({ withShareTicket: true }); wx.showToast({ title: '请点击右上角分享', icon: 'none' }) },
  onShareAppMessage() { return { title: `我已经掌握了 ${app.getProgress().learnedWords.length} 个单词！`, path: '/pages/report/report' } }
})
