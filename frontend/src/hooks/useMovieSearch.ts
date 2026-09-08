import { useMemo, useState, useCallback } from 'react'
import { useQuery, useQueryClient, useMutation, keepPreviousData } from '@tanstack/react-query'
import { searchMovies, addMovie } from '../api/movies'
import type { TmdbMovie } from '../api/movies'
import { useDebounce } from './useDebounce'
import { usePopularMovies } from './usePopularMovies'
import { QUERY_KEYS, STALE_TIMES, MIN_SEARCH_CHAR_LENGTH, DEBOUNCE_DELAY_MS } from '../constants'

export function useMovieSearch() {
  const [input, setInput] = useState('')

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'error' | 'warning'
  }>({ open: false, message: '', severity: 'error' })

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }, [])

  const debouncedQuery = useDebounce(input.trim().toLowerCase(), DEBOUNCE_DELAY_MS)
  const queryClient = useQueryClient()

  const { data: popularMovies } = usePopularMovies()

  const {
    data: searchResults,
    isFetching,
    isError: isSearchError,
  } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MOVIES, debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length >= MIN_SEARCH_CHAR_LENGTH,
    staleTime: STALE_TIMES.SEARCH,
    placeholderData: keepPreviousData,
  })

  const addMutation = useMutation({
    mutationFn: addMovie,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_MOVIES] }),
    onError: (error) => {
      const status = (error as import('axios').AxiosError)?.response?.status
      if (status === 409) {
        setSnackbar({ open: true, message: 'This movie is already in your list.', severity: 'warning' })
      } else {
        setSnackbar({ open: true, message: 'An error occurred while adding the movie.', severity: 'error' })
      }
    },
  })

  const trimmedInput = input.trim().toLowerCase()

  const movies: TmdbMovie[] = useMemo(() => {
    if (trimmedInput.length === 0) return []

    const localMatches = popularMovies?.filter((m) =>
      m.title.toLowerCase().includes(trimmedInput)
    ) ?? []

    if (trimmedInput.length < MIN_SEARCH_CHAR_LENGTH || !searchResults) {
      return localMatches
    }

    const localIds = new Set(localMatches.map((m) => m.tmdbId))
    const uniqueApiResults = searchResults.filter((apiMovie) => !localIds.has(apiMovie.tmdbId))

    return [...localMatches, ...uniqueApiResults]
  }, [trimmedInput, popularMovies, searchResults])

  return {
    isFetching: trimmedInput.length >= MIN_SEARCH_CHAR_LENGTH && isFetching,
    isSearchError,
    input,
    setInput,
    movies,
    addMovie: addMutation.mutate,
    addingMovieId: addMutation.isPending ? addMutation.variables?.tmdbId : undefined,
    snackbar,
    closeSnackbar,
  }
}