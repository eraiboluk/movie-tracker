import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Typography, Skeleton } from '@mui/material'
import { getMyMovies, deleteMovie } from '../api/movies'
import { QUERY_KEYS } from '../constants'
import { MovieCard } from './MovieCard'

export function MyMovies() {
  const queryClient = useQueryClient()

  const { data: movies, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MY_MOVIES],
    queryFn: getMyMovies,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_MOVIES] }),
  })

  const deletingId = deleteMutation.isPending ? deleteMutation.variables : undefined

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 3 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" sx={{ aspectRatio: '2/3', width: '100%' }} />
        ))}
      </Box>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        You don't have any movies in your list yet. You can add movies using the search box above.
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 3 }}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isDeleting={deletingId === movie.id}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ))}
    </Box>
  )
}