import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
} from '@mui/material'
import { getPopularMovies, getPosterUrl } from '../api/movies'
import { QUERY_KEYS, STALE_TIMES, POPULAR_MOVIES_POSTER_SIZE } from '../constants'

export function PopularMovies() {
  const { data: movies, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.POPULAR_MOVIES],
    queryFn: getPopularMovies,
    staleTime: STALE_TIMES.POPULAR_MOVIES,
  })

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Popular Films
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: 4,
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={150}
                height={225}
                sx={{ flexShrink: 0 }}
              />
            ))
          : movies?.map((movie) => {
              const posterUrl = getPosterUrl(movie.posterPath, POPULAR_MOVIES_POSTER_SIZE)
              return (
                <Card
                  key={movie.tmdbId}
                  sx={{
                    minWidth: 150,
                    maxWidth: 150,
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  {posterUrl ? (
                    <CardMedia
                      component="img"
                      height={225}
                      image={posterUrl}
                      alt={movie.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 225,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.200',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        ...
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="caption" noWrap title={movie.title}>
                      {movie.title}
                    </Typography>
                    {movie.releaseDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {movie.releaseDate.split('-')[0]}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )
            })}
      </Box>
    </Box>
  )
}