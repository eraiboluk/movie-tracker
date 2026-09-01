import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TextField, Button, Card, CardContent, CardActions, Typography, Stack, CircularProgress } from '@mui/material'
import { searchMovies, addMovie, type TmdbMovie } from '../api/movies'

export function MovieSearch() {
  const [input, setInput] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: results, isFetching } = useQuery({
    queryKey: ['tmdb-search', submittedQuery],
    queryFn: () => searchMovies(submittedQuery),
    enabled: submittedQuery.length > 0,
  })

  const addMutation = useMutation({
    mutationFn: addMovie,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-movies'] }),
  })

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Search film"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSubmittedQuery(input.trim())}
        />
        <Button variant="outlined" onClick={() => setSubmittedQuery(input.trim())}>Search</Button>
      </Stack>

      {isFetching && <CircularProgress size={31} />}

      <Stack spacing={1}>
        {results?.map((movie) => (
          <Card key={movie.tmdbId}>
            <CardContent>
              <Typography variant="h4" color="primary">{movie.title}</Typography>
              <Typography variant="body2" color="text.secondary">{movie.overview}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => addMutation.mutate(movie)} disabled={addMutation.isPending}>
                Add to my list
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}