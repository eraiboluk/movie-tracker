export const MIN_SEARCH_CHAR_LENGTH = 3

export const DEBOUNCE_DELAY_MS = 300

export const API_BASE_URL = 'http://localhost:5185/api'

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const TMDB_POSTER_SIZES = {
  SMALL: 'w185',
  MEDIUM: 'w342',
  LARGE: 'w500',
} as const

export const DEFAULT_POSTER_SIZE: keyof typeof TMDB_POSTER_SIZES = 'MEDIUM'
export const POPULAR_MOVIES_POSTER_SIZE: keyof typeof TMDB_POSTER_SIZES = 'SMALL'
export const SEARCH_RESULT_POSTER_SIZE: keyof typeof TMDB_POSTER_SIZES = 'SMALL'

export const QUERY_KEYS = {
  POPULAR_MOVIES: 'popular-movies',
  SEARCH_MOVIES: 'tmdb-search',
  MY_MOVIES: 'my-movies',
} as const

export const STALE_TIMES = {
  POPULAR_MOVIES: 1000 * 60 * 30,
  SEARCH: 1000 * 60 * 5,
} as const