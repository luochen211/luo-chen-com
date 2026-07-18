const STORAGE_KEY = 'dailyWordsProgressV1'

function dateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function defaultProgress() {
  return {
    version: 1,
    dailyGoal: 20,
    dailyCounts: {},
    learnedWords: [],
    favoriteWords: [],
    learningRecords: [],
    quizRecords: [],
    updatedAt: 0
  }
}

function normalizeProgress(value) {
  const base = defaultProgress()
  if (!value || typeof value !== 'object') return base
  return {
    ...base,
    ...value,
    dailyCounts: value.dailyCounts || {},
    learnedWords: Array.isArray(value.learnedWords) ? value.learnedWords : [],
    favoriteWords: Array.isArray(value.favoriteWords) ? value.favoriteWords : [],
    learningRecords: Array.isArray(value.learningRecords) ? value.learningRecords.slice(-1000) : [],
    quizRecords: Array.isArray(value.quizRecords) ? value.quizRecords.slice(-1000) : []
  }
}

function recentDateKeys(days = 7) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() - (days - index - 1))
    return dateKey(date)
  })
}

function calculateStreak(dailyCounts) {
  let streak = 0
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)
  if (!dailyCounts[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1)
  while (dailyCounts[dateKey(cursor)] > 0) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

module.exports = { STORAGE_KEY, calculateStreak, dateKey, defaultProgress, normalizeProgress, recentDateKeys }
