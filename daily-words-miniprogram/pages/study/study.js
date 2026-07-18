const words = require('../../data/words')
const { dateKey } = require('../../utils/progress')
const app = getApp()

Page({
  data: { index: 0, word: words[0], total: words.length, favorite: false, playing: false, touchStartX: 0 },
  async onLoad() {
    this.audio = wx.createInnerAudioContext()
    this.audio.onPlay(() => this.setData({ playing: true }))
    this.audio.onEnded(() => this.setData({ playing: false }))
    this.audio.onStop(() => this.setData({ playing: false }))
    this.audio.onError(() => {
      this.setData({ playing: false })
      wx.showToast({ title: '发音播放失败，请重试', icon: 'none' })
    })
    await app.globalData.ready
    this.showWord(0)
  },
  onUnload() {
    if (this.audio) this.audio.destroy()
  },
  showWord(index) {
    if (this.audio) this.audio.stop()
    const word = words[index]
    this.setData({ index, word, playing: false, favorite: app.getProgress().favoriteWords.includes(word.id) })
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
  pronounce() {
    if (!this.audio || !this.data.word.audio) return
    if (this.data.playing) {
      this.audio.stop()
      return
    }
    this.audio.src = this.data.word.audio
    this.audio.play()
  },
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
