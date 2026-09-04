import {
  TextField,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Stack,
  CircularProgress,
  Box,
  Button,
} from '@mui/material'
import { getPosterUrl } from '../api/movies'
import { SEARCH_RESULT_POSTER_SIZE } from '../constants'
import { useMovieSearch } from '../hooks/useMovieSearch'

export function MovieSearch() {
  const { input, setInput, movies, isFetching, addMovie, isAdding } =
    useMovieSearch()

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Search film"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {isFetching && <CircularProgress size={24} />}

      <Stack spacing={1}>
        {movies.map((movie) => {
          const posterUrl = getPosterUrl(movie.posterPath, SEARCH_RESULT_POSTER_SIZE)
          return (
            <Card key={movie.tmdbId} sx={{ display: 'flex' }}>
              {posterUrl ? (
                <CardMedia
                  component="img"
                  sx={{ width: 80, objectFit: 'cover' }}
                  image={posterUrl}
                  alt={movie.title}
                />
              ) : (
                <Box
                  sx={{
                    width: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    N/A
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', pb: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {movie.title}
                  </Typography>
                  {movie.releaseDate && (
                    <Typography variant="body2" color="text.secondary">
                      {movie.releaseDate.split('-')[0]}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {movie.overview}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => addMovie(movie)}
                    disabled={isAdding}
                  >
                    Add
                  </Button>
                </CardActions>
              </Box>
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}