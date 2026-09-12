import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, IconButton, Skeleton, Chip, Stack, Fade, Button, Snackbar, Alert } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { getPosterUrl, getMyMovies, getMovieReview, addMovie } from '../api/movies'
import { UI, QUERY_KEYS } from '../constants'
import { ReviewModal } from '../components/ReviewModal'

export function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const tmdbId = Number(id)

  const [modalOpen, setModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'warning' | 'success' }>({ open: false, message: '', severity: 'error' })

  const { data: movie, isLoading, isError } = useMovieDetails(tmdbId)

  const { data: myMovies } = useQuery({
    queryKey: [QUERY_KEYS.MY_MOVIES],
    queryFn: getMyMovies,
  })

  const localMovie = myMovies?.find(m => m.tmdbId === tmdbId)

  const { data: review } = useQuery({
    queryKey: [QUERY_KEYS.MOVIE_REVIEW, localMovie?.id],
    queryFn: () => getMovieReview(localMovie!.id),
    enabled: !!localMovie,
  })

  const addMutation = useMutation({
    mutationFn: addMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_MOVIES] })
      setSnackbar({ open: true, message: 'Movie added successfully!', severity: 'success' })
      setModalOpen(false)
    },
    onError: (error) => {
      const status = (error as import('axios').AxiosError)?.response?.status
      if (status === 409) {
        setSnackbar({ open: true, message: 'This movie is already in your list.', severity: 'warning' })
      } else {
        setSnackbar({ open: true, message: 'An error occurred.', severity: 'error' })
      }
    },
  })

  const handleModalSave = (rating: number, watchedOn: string, comment?: string) => {
    if (!movie) return
    addMutation.mutate({
      tmdbId: movie.tmdbId,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      rating,
      watchedOn,
      comment,
    })
  }

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
    <Fade in={true} timeout={UI.PAGE_TRANSITION_DURATION_MS}>
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
                width: { xs: '100%', md: UI.MOVIE_DETAILS.POSTER_WIDTH },
                borderRadius: theme.custom?.card?.borderRadius ?? 2,
                boxShadow: 3,
                objectFit: 'cover'
              }}
            />
          ) : (
            <Box sx={{ 
              width: { xs: '100%', md: UI.MOVIE_DETAILS.POSTER_WIDTH }, 
              height: UI.MOVIE_DETAILS.POSTER_HEIGHT, 
              bgcolor: 'grey.800', 
              borderRadius: theme.custom?.card?.borderRadius ?? 2 
            }} />
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
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
              {movie.overview || 'No overview available.'}
            </Typography>

            {localMovie ? (
              <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'success.main' }}>
                  <CheckCircleIcon />
                  <Typography variant="h6">In Your List</Typography>
                </Stack>
                {review ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Watched on:</strong> {new Date(review.watchedOn).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Rating:</strong> {review.rating} / 10
                    </Typography>
                    {review.comment && (
                      <Typography variant="body1" sx={{ fontStyle: 'italic', borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, py: 0.5 }}>
                        {review.comment}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Skeleton width="100%" height={80} />
                )}
              </Box>
            ) : (
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<AddIcon />} 
                onClick={() => setModalOpen(true)}
              >
                Add to List
              </Button>
            )}
          </Box>
        </Box>

        {modalOpen && (
          <ReviewModal
            movie={movie}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
            isSaving={addMutation.isPending}
          />
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={UI.SNACKBAR_AUTO_HIDE_DURATION_MS}
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  )
}
