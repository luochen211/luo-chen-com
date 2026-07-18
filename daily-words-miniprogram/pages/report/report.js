Page({
  data: {
    bars: [
      { day: '周一', value: 32, height: 72 }, { day: '周二', value: 45, height: 104 },
      { day: '周三', value: 56, height: 132 }, { day: '周四', value: 62, height: 150 },
      { day: '周五', value: 48, height: 112 }, { day: '周六', value: 36, height: 82 },
      { day: '周日', value: 58, height: 140 }
    ],
    stats: [
      { icon: '/assets/icons/book.png', label: '已掌握', value: '128' }, { icon: '/assets/icons/calendar.png', label: '待复习', value: '24' },
      { icon: '/assets/icons/target.png', label: '正确率', value: '92%' }, { icon: '/assets/icons/flame.png', label: '连续学习', value: '12 天' }
    ]
  },
  share() { wx.showShareMenu({ withShareTicket: true }); wx.showToast({ title: '请点击右上角分享', icon: 'none' }) },
  onShareAppMessage() { return { title: '我本周背了 128 个单词！', path: '/pages/report/report' } }
})
