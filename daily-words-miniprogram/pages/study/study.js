const words = [
  { word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', meaning: '意外发现美好事物的运气', prefix: 'I found this book by pure ', suffix: '.' },
  { word: 'resilient', phonetic: '/rɪˈzɪliənt/', meaning: '坚韧的；有恢复力的', prefix: 'Children are often more ', suffix: ' than we expect.' },
  { word: 'eloquent', phonetic: '/ˈeləkwənt/', meaning: '雄辩的；有说服力的', prefix: 'She gave an ', suffix: ' speech.' }
]
Page({
  data: { index: 0, word: words[0], total: words.length, favorite: false, touchStartX: 0 },
  next() { const index = (this.data.index + 1) % words.length; this.setData({ index, word: words[index], favorite: false }) },
  unknown() { wx.navigateTo({ url: '/pages/quiz/quiz' }) },
  toggleFavorite() { this.setData({ favorite: !this.data.favorite }); wx.vibrateShort({ type: 'light' }) },
  pronounce() { wx.showToast({ title: this.data.word.word, icon: 'none' }) },
  touchStart(e) { this.setData({ touchStartX: e.changedTouches[0].clientX }) },
  touchEnd(e) {
    const distance = e.changedTouches[0].clientX - this.data.touchStartX
    if (Math.abs(distance) < 45) return
    if (distance < 0) return this.next()
    const index = (this.data.index - 1 + words.length) % words.length
    this.setData({ index, word: words[index], favorite: false })
  },
  onShareAppMessage() { return { title: '我正在学习“' + this.data.word.word + '”' } }
})
