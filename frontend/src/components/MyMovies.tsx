import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { getMyMovies, deleteMovie } from '../api/movies'
import { QUERY_KEYS } from '../constants'

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

  if (isLoading) return <Typography>Loading...</Typography>

  return (
    <List>
      {movies?.map((movie) => (
        <ListItem
          key={movie.id}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => deleteMutation.mutate(movie.id)}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={movie.title} secondary={movie.releaseDate} />
        </ListItem>
      ))}
    </List>
  )
}