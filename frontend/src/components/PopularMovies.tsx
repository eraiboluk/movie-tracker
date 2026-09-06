import { Box, Card, CardMedia, Skeleton, Typography } from '@mui/material'
import { keyframes } from '@mui/system'
import { getPosterUrl } from '../api/movies'
import { POPULAR_MOVIES_POSTER_SIZE } from '../constants'
import { usePopularMovies } from '../hooks/usePopularMovies'
import type { TmdbMovie } from '../api/movies'

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`

const CARD_WIDTH = 150
const CARD_GAP = 16

interface PopularMoviesProps {
  pixelsPerSecond?: number
  onMovieClick?: (movie: TmdbMovie) => void
}

export function PopularMovies({ pixelsPerSecond = 40, onMovieClick }: PopularMoviesProps) {
  const { data: movies, isLoading } = usePopularMovies()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={150} height={225} sx={{ flexShrink: 0 }} />
        ))}
      </Box>
    )
  }

  if (!movies || movies.length === 0) return null

  const repeatedMovies = [...movies, ...movies]
  const totalWidth = movies.length * (CARD_WIDTH + CARD_GAP)
  const duration = totalWidth / pixelsPerSecond

  return (
    <Box sx={{ overflow: 'hidden', display: 'flex', width: '100%', py: 1 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          paddingRight: 2,
          animation: `${marquee} ${duration}s linear infinite`,
          '&:hover': { animationPlayState: 'paused' },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {repeatedMovies.map((movie, index) => {
          const posterUrl = getPosterUrl(movie.posterPath, POPULAR_MOVIES_POSTER_SIZE)
          return (
            <Card
              key={`${movie.tmdbId}-${index}`}
              onClick={onMovieClick ? () => onMovieClick(movie) : undefined}
              sx={{
                width: 150,
                height: 225,
                flexShrink: 0,
                borderRadius: 2,
                cursor: onMovieClick ? 'pointer' : 'default',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {posterUrl ? (
                <CardMedia component="img" height="100%" image={posterUrl} alt={movie.title} sx={{ objectFit: 'cover' }} />
              ) : (
                <Box sx={{ height: '100%', bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "center",
                      p: 1
                    }}>{movie.title}</Typography>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}