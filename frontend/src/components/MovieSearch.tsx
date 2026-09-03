import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Stack,
  CircularProgress,
  Box,
} from '@mui/material'
import { searchMovies, addMovie, getPosterUrl } from '../api/movies'
import { QUERY_KEYS, SEARCH_RESULT_POSTER_SIZE } from '../constants'

export function MovieSearch() {
  const [input, setInput] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: results, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MOVIES, submittedQuery],
    queryFn: () => searchMovies(submittedQuery),
    enabled: submittedQuery.length > 0,
  })

  const addMutation = useMutation({
    mutationFn: addMovie,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_MOVIES] }),
  })

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Search film"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && setSubmittedQuery(input.trim())
          }
        />
        <Button
          variant="outlined"
          onClick={() => setSubmittedQuery(input.trim())}
        >
          Search
        </Button>
      </Stack>

      {isFetching && <CircularProgress size={24} />}

      <Stack spacing={1}>
        {results?.map((movie) => {
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
                  <Typography variant="subtitle1" fontWeight="bold">
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
                    onClick={() => addMutation.mutate(movie)}
                    disabled={addMutation.isPending}
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