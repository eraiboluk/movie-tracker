import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { searchMovies, addMovie } from '../api/movies'
import type { TmdbMovie } from '../api/movies'
import { useDebounce } from './useDebounce'
import { usePopularMovies } from './usePopularMovies'
import { QUERY_KEYS, STALE_TIMES, MIN_SEARCH_CHAR_LENGTH, DEBOUNCE_DELAY_MS } from '../constants'

export function useMovieSearch() {
    const [input, setInput] = useState('')
    const debouncedQuery = useDebounce(input.trim().toLowerCase(), DEBOUNCE_DELAY_MS)
    const queryClient = useQueryClient()

    const { data: popularMovies } = usePopularMovies()

    const { data: searchResults, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MOVIES, debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length >= MIN_SEARCH_CHAR_LENGTH,
    staleTime: STALE_TIMES.SEARCH,
    })

    const addMutation = useMutation({
    mutationFn: addMovie,
    onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_MOVIES] }),
    })

    const trimmedInput = input.trim().toLowerCase()

     const movies: TmdbMovie[] = (() => {
        if (trimmedInput.length === 0) return []

        const localMatches = popularMovies?.filter((m) =>
        m.title.toLowerCase().includes(trimmedInput)
        ) ?? []

        if (trimmedInput.length < MIN_SEARCH_CHAR_LENGTH || !searchResults) {
        return localMatches
        }

        const localIds = new Set(localMatches.map(m => m.tmdbId))

        const uniqueApiResults = searchResults.filter(apiMovie => !localIds.has(apiMovie.tmdbId))

        return [...localMatches, ...uniqueApiResults]
    })()

    return {
    input,
    setInput,
    movies,
    isFetching: trimmedInput.length >= MIN_SEARCH_CHAR_LENGTH && isFetching,
    addMovie: addMutation.mutate,
    isAdding: addMutation.isPending,
    }
}