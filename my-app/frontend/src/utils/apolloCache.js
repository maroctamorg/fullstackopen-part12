import { ALL_BOOKS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  const updater = (existing) => {
    const list = existing?.allBooks ?? []
    const bookExists = list.some((book) => book.id === bookToAdd.id)

    if (bookExists) {
      return existing ?? { allBooks: list }
    }

    return { allBooks: list.concat(bookToAdd) }
  }

  cache.updateQuery({ query: ALL_BOOKS }, updater);
  ((bookToAdd.genres || []).concat(null)).forEach((genre) => {
    cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, updater)
  })
}