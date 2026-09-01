import { apiClient } from './axiosClient'

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

export const searchMovies = async (query: string): Promise<TmdbMovie[]> => {
  const { data } = await apiClient.get<TmdbMovie[]>('/movies/search', { params: { query } })
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