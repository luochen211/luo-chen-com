const words = require('../../data/words')
const { dateKey } = require('../../utils/progress')
const app = getApp()

Page({
  data: { index: 0, word: words[0], total: words.length, favorite: false, touchStartX: 0 },
  async onLoad() {
    await app.globalData.ready
    this.showWord(0)
  },
  showWord(index) {
    const word = words[index]
    this.setData({ index, word, favorite: app.getProgress().favoriteWords.includes(word.id) })
  },
  record(result) {
    const word = this.data.word
    app.saveProgress((progress) => {
      const today = dateKey()
      progress.dailyCounts[today] = (progress.dailyCounts[today] || 0) + 1
      if (result === 'known' && !progress.learnedWords.includes(word.id)) progress.learnedWords.push(word.id)
      progress.learningRecords.push({ wordId: word.id, result, learnedAt: Date.now(), date: today })
    })
  },
  next() {
    this.record('known')
    this.showWord((this.data.index + 1) % words.length)
  },
  unknown() {
    this.record('unknown')
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },
  toggleFavorite() {
    const wordId = this.data.word.id
    const favorite = !this.data.favorite
    this.setData({ favorite })
    app.saveProgress((progress) => {
      progress.favoriteWords = favorite
        ? Array.from(new Set([...progress.favoriteWords, wordId]))
        : progress.favoriteWords.filter((id) => id !== wordId)
    })
    wx.vibrateShort({ type: 'light' })
  },
  pronounce() { wx.showToast({ title: this.data.word.word, icon: 'none' }) },
  touchStart(e) { this.setData({ touchStartX: e.changedTouches[0].clientX }) },
  touchEnd(e) {
    const distance = e.changedTouches[0].clientX - this.data.touchStartX
    if (Math.abs(distance) < 45) return
    if (distance < 0) return this.showWord((this.data.index + 1) % words.length)
    const index = (this.data.index - 1 + words.length) % words.length
    this.showWord(index)
  },
  onShareAppMessage() { return { title: '我正在学习“' + this.data.word.word + '”' } }
})
