import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, IconButton, Skeleton, Chip, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTheme } from '@mui/material/styles'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { getPosterUrl } from '../api/movies'

export function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const tmdbId = Number(id)

  const { data: movie, isLoading, isError } = useMovieDetails(tmdbId)

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: theme.custom?.card?.borderRadius ?? 2 }} />
      </Container>
    )
  }

  if (isError || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography color="error">Failed to load movie details.</Typography>
      </Container>
    )
  }

  const posterUrl = getPosterUrl(movie.posterPath, 'LARGE')

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 4, color: 'text.primary' }}>
        <ArrowBackIcon />
      </IconButton>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {posterUrl ? (
          <Box
            component="img"
            src={posterUrl}
            alt={movie.title}
            sx={{
              width: { xs: '100%', md: 300 },
              borderRadius: theme.custom?.card?.borderRadius ?? 2,
              boxShadow: 3,
            }}
          />
        ) : (
          <Box sx={{ width: { xs: '100%', md: 300 }, height: 450, bgcolor: 'grey.800', borderRadius: theme.custom?.card?.borderRadius ?? 2 }} />
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {movie.title}
          </Typography>
          
          {movie.tagline && (
            <Typography variant="h6" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
              {movie.tagline}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            {movie.releaseDate && (
              <Chip label={movie.releaseDate.split('-')[0]} variant="outlined" />
            )}
            {movie.runtime ? (
              <Chip label={`${movie.runtime} min`} variant="outlined" />
            ) : null}
            {movie.voteAverage ? (
              <Chip label={`★ ${movie.voteAverage.toFixed(1)}`} variant="outlined" color="primary" />
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
            {movie.genres?.map(genre => (
              <Chip key={genre} label={genre} size="small" />
            ))}
          </Stack>

          <Typography variant="h5" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {movie.overview || 'No overview available.'}
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
