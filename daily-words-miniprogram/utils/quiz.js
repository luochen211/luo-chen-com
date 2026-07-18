const LETTERS = ['A', 'B', 'C', 'D']

function shuffle(items, random = Math.random) {
  const result = items.slice()
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    const value = result[index]
    result[index] = result[target]
    result[target] = value
  }
  return result
}

function createQuiz(words, count = 10, random = Math.random) {
  return shuffle(words, random).slice(0, Math.min(count, words.length)).map((word) => {
    const distractors = shuffle(words.filter((item) => item.id !== word.id), random)
      .slice(0, 3)
      .map((item) => item.meaning)
    const meanings = shuffle([word.meaning, ...distractors], random)
    return {
      wordId: word.id,
      word: word.word,
      correctIndex: meanings.indexOf(word.meaning),
      options: meanings.map((text, index) => ({ letter: LETTERS[index], text, state: '', mark: '' }))
    }
  })
}

module.exports = { createQuiz, shuffle }
