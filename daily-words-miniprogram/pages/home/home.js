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
  startStudy() { wx.navigateTo({ url: '/pages/study/study' }) },
  openReport() { wx.navigateTo({ url: '/pages/report/report' }) },
  openLibrary() { wx.showToast({ title: '词库正在整理中', icon: 'none' }) },
  editGoal() {
    wx.showModal({ title: '修改每日目标', editable: true, placeholderText: '请输入 5-100 的数字', success: ({ confirm, content }) => {
      const goal = Number(content)
      if (confirm && goal >= 5 && goal <= 100) {
        this.setData({ goal, percent: Math.min(100, Math.round(this.data.learned / goal * 100)) })
      } else if (confirm) {
        wx.showToast({ title: '请输入 5–100 的数字', icon: 'none' })
      }
    } })
  }
})
