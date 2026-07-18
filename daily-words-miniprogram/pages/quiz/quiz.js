const { dateKey } = require('../../utils/progress')
const app = getApp()

Page({
  data: { selected: -1, current: 1, options: [{ letter: 'A', text: '急躁的' }, { letter: 'B', text: '有弹性的；灵活的' }, { letter: 'C', text: '坚韧的；有恢复力的' }, { letter: 'D', text: '冷淡的；无情的' }] },
  select(e) { this.setData({ selected: Number(e.currentTarget.dataset.index) }); wx.vibrateShort({ type: 'light' }) },
  next() {
    if (this.data.selected < 0) return wx.showToast({ title: '请先选择答案', icon: 'none' })
    app.saveProgress((progress) => {
      progress.quizRecords.push({
        wordId: 'resilient',
        selected: this.data.selected,
        correct: this.data.selected === 2,
        answeredAt: Date.now(),
        date: dateKey()
      })
    })
    if (this.data.current >= 10) return wx.redirectTo({ url: '/pages/report/report' })
    this.setData({ current: this.data.current + 1, selected: -1 })
  }
})
