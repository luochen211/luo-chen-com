const words = require('../../data/words')

const app = getApp()

const FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'learning', label: '学习中' },
  { id: 'learned', label: '已掌握' },
  { id: 'favorite', label: '已收藏' }
]

Page({
  data: {
    query: '',
    filter: 'all',
    filters: FILTERS,
    counts: { all: 0, learning: 0, learned: 0, favorite: 0 },
    progressPercent: 0,
    visibleWords: [],
    expandedId: '',
    emptyTitle: '',
    emptyHint: ''
  },

  async onLoad() {
    this.audio = wx.createInnerAudioContext()
    this.audio.onError(() => wx.showToast({ title: '发音播放失败，请重试', icon: 'none' }))
    await app.globalData.ready
    this.refresh()
  },

  onShow() {
    if (app.globalData.ready) app.globalData.ready.then(() => this.refresh())
  },

  onUnload() {
    if (this.audio) this.audio.destroy()
  },

  refresh() {
    const progress = app.getProgress()
    const learned = new Set(progress.learnedWords)
    const favorites = new Set(progress.favoriteWords)
    const attempted = new Set(progress.learningRecords.map((record) => record.wordId))
    const items = words.map((word) => ({
      ...word,
      learned: learned.has(word.id),
      favorite: favorites.has(word.id),
      learning: attempted.has(word.id) && !learned.has(word.id),
      example: `${word.prefix}${word.word}${word.suffix}`,
      initial: word.word.slice(0, 1).toUpperCase()
    }))

    this.words = items
    const counts = {
      all: items.length,
      learning: items.filter((word) => word.learning).length,
      learned: items.filter((word) => word.learned).length,
      favorite: items.filter((word) => word.favorite).length
    }
    this.setData({
      counts,
      progressPercent: counts.all ? Math.round(counts.learned / counts.all * 100) : 0,
      filters: FILTERS.map((filter) => ({ ...filter, count: counts[filter.id] }))
    })
    this.applyFilter()
  },

  applyFilter() {
    if (!this.words) return
    const query = this.data.query.trim().toLowerCase()
    const visibleWords = this.words.filter((word) => {
      const matchesFilter = this.data.filter === 'all' || Boolean(word[this.data.filter])
      const matchesQuery = !query || word.word.toLowerCase().includes(query) || word.meaning.includes(query)
      return matchesFilter && matchesQuery
    })
    const filtering = this.data.filter !== 'all'
    this.setData({
      visibleWords,
      emptyTitle: query ? '没有找到这个单词' : filtering ? '这里暂时是空的' : '词库还没有内容',
      emptyHint: query ? '换个拼写或中文释义试试' : filtering ? '继续学习，单词会自动归入这里' : '完成学习后再回来看看'
    })
  },

  handleSearch(event) {
    this.setData({ query: event.detail.value }, () => this.applyFilter())
  },

  clearSearch() {
    this.setData({ query: '' }, () => this.applyFilter())
  },

  selectFilter(event) {
    this.setData({ filter: event.currentTarget.dataset.filter, expandedId: '' }, () => this.applyFilter())
  },

  toggleWord(event) {
    const id = event.currentTarget.dataset.id
    this.setData({ expandedId: this.data.expandedId === id ? '' : id })
  },

  toggleFavorite(event) {
    const id = event.currentTarget.dataset.id
    app.saveProgress((progress) => {
      progress.favoriteWords = progress.favoriteWords.includes(id)
        ? progress.favoriteWords.filter((wordId) => wordId !== id)
        : [...progress.favoriteWords, id]
    })
    wx.vibrateShort({ type: 'light' })
    this.refresh()
  },

  pronounce(event) {
    const word = this.words.find((item) => item.id === event.currentTarget.dataset.id)
    if (!word || !word.audio || !this.audio) return
    this.audio.stop()
    this.audio.src = word.audio
    this.audio.play()
  },

  startStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  openHome() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/home/home' }) })
  },

  openQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  openReport() {
    wx.navigateTo({ url: '/pages/report/report' })
  }
})
