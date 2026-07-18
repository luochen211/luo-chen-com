const { dateKey } = require('../../utils/progress')
const { createQuiz } = require('../../utils/quiz')
const quizQuestions = require('../../data/quizQuestions')
const app = getApp()

Page({
  data: { selected: -1, current: 1, total: 10, question: null, options: [], answered: false, correct: false, feedback: '' },
  onLoad() {
    this.questions = createQuiz(quizQuestions, 10)
    this.setData({ total: this.questions.length })
    this.showQuestion(0)
  },
  showQuestion(index) {
    const question = this.questions[index]
    this.setData({
      current: index + 1,
      question,
      options: question.options,
      selected: -1,
      answered: false,
      correct: false,
      feedback: ''
    })
  },
  select(e) {
    if (this.data.answered) return
    const selected = Number(e.currentTarget.dataset.index)
    const question = this.data.question
    const correct = selected === question.correctIndex
    const options = question.options.map((option, index) => ({
      ...option,
      state: index === question.correctIndex ? 'correct' : (index === selected ? 'wrong' : 'muted'),
      mark: index === question.correctIndex ? '✓' : (index === selected ? '×' : '')
    }))
    this.setData({
      selected,
      options,
      answered: true,
      correct,
      feedback: correct ? '回答正确' : `正确答案：${question.options[question.correctIndex].text}`
    })
    app.saveProgress((progress) => {
      progress.quizRecords.push({
        wordId: question.wordId,
        selected,
        correct,
        answeredAt: Date.now(),
        date: dateKey()
      })
    })
    wx.vibrateShort({ type: correct ? 'light' : 'medium' })
  },
  next() {
    if (!this.data.answered) return wx.showToast({ title: '请先选择答案', icon: 'none' })
    if (this.data.current >= this.data.total) return wx.redirectTo({ url: '/pages/report/report' })
    this.showQuestion(this.data.current)
  }
})
