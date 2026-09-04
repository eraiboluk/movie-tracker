import { useQuery } from '@tanstack/react-query'
import { getPopularMovies } from '../api/movies'
import { QUERY_KEYS, STALE_TIMES } from '../constants'

export function usePopularMovies() {
    return useQuery({
        queryKey: [QUERY_KEYS.POPULAR_MOVIES],
        queryFn: getPopularMovies,
        staleTime: STALE_TIMES.POPULAR_MOVIES,
    })
}