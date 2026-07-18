Page({
  data: { selected: 2, current: 7, options: [{ letter: 'A', text: '急躁的' }, { letter: 'B', text: '有弹性的；灵活的' }, { letter: 'C', text: '坚韧的；有恢复力的' }, { letter: 'D', text: '冷淡的；无情的' }] },
  select(e) { this.setData({ selected: Number(e.currentTarget.dataset.index) }); wx.vibrateShort({ type: 'light' }) },
  next() {
    if (this.data.current >= 10) return wx.redirectTo({ url: '/pages/report/report' })
    this.setData({ current: this.data.current + 1, selected: -1 })
  }
})
