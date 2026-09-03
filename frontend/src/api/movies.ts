import { apiClient } from './axiosClient'
import { TMDB_IMAGE_BASE_URL, TMDB_POSTER_SIZES, DEFAULT_POSTER_SIZE } from '../constants'

export interface TmdbMovie {
  tmdbId: number
  title: string
  overview?: string
  posterPath?: string
  releaseDate?: string
}

export interface Movie extends TmdbMovie {
  id: number
  createdAt: string
}

export const getPosterUrl = (
  posterPath: string | null | undefined,
  size: keyof typeof TMDB_POSTER_SIZES = DEFAULT_POSTER_SIZE
): string | null => {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${TMDB_POSTER_SIZES[size]}${posterPath}`
}

export const searchMovies = async (query: string): Promise<TmdbMovie[]> => {
  const { data } = await apiClient.get<TmdbMovie[]>('/movies/search', {
    params: { query },
  })
  return data
}

export const getPopularMovies = async (): Promise<TmdbMovie[]> => {
  const { data } = await apiClient.get<TmdbMovie[]>('/movies/popular')
  return data
}

export const getMyMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<Movie[]>('/movies')
  return data
}

export const addMovie = async (movie: TmdbMovie): Promise<Movie> => {
  const { data } = await apiClient.post<Movie>('/movies', movie)
  return data
}

export const deleteMovie = async (id: number): Promise<void> => {
  await apiClient.delete(`/movies/${id}`)
}