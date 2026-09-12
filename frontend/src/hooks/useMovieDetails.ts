import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '../api/movies'
import { QUERY_KEYS, STALE_TIMES } from '../constants'

export function useMovieDetails(tmdbId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.MOVIE_DETAILS, tmdbId],
        queryFn: () => getMovieDetails(tmdbId),
        staleTime: STALE_TIMES.MOVIE_DETAILS,
        enabled: !!tmdbId,
    })
}
