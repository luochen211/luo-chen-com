const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const collection = db.collection('user_progress')

function sanitize(value) {
  const progress = value && typeof value === 'object' ? value : {}
  return {
    version: 1,
    dailyGoal: Math.min(100, Math.max(5, Number(progress.dailyGoal) || 20)),
    dailyCounts: progress.dailyCounts && typeof progress.dailyCounts === 'object' ? progress.dailyCounts : {},
    learnedWords: Array.isArray(progress.learnedWords) ? progress.learnedWords.slice(-5000) : [],
    favoriteWords: Array.isArray(progress.favoriteWords) ? progress.favoriteWords.slice(-5000) : [],
    learningRecords: Array.isArray(progress.learningRecords) ? progress.learningRecords.slice(-1000) : [],
    quizRecords: Array.isArray(progress.quizRecords) ? progress.quizRecords.slice(-1000) : [],
    updatedAt: Number(progress.updatedAt) || 0
  }
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const incoming = sanitize(event.progress)
  const existingResult = await collection.where({ _openid: OPENID }).limit(1).get()
  const existing = existingResult.data[0]

  if (existing && Number(existing.updatedAt) > incoming.updatedAt) {
    const { _id, _openid, ...progress } = existing
    return { progress }
  }

  const data = { ...incoming, _openid: OPENID, serverUpdatedAt: db.serverDate() }
  if (existing) await collection.doc(existing._id).set({ data })
  else await collection.add({ data })
  return { progress: incoming }
}
