import { Card, CardMedia, Box, Typography, IconButton, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { getPosterUrl } from '../api/movies'
import type { Movie } from '../api/movies'
import { DEFAULT_POSTER_SIZE } from '../constants'

interface MovieCardProps {
  movie: Movie
  isDeleting: boolean
  onDelete: (id: Movie['id']) => void
}

export function MovieCard({ movie, isDeleting, onDelete }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.posterPath, DEFAULT_POSTER_SIZE)

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        aspectRatio: '2/3',
        '&:hover .delete-btn': { opacity: 1 },
      }}
    >
      {posterUrl ? (
        <CardMedia component="img" height="100%" image={posterUrl} alt={movie.title} sx={{ objectFit: 'cover' }} />
      ) : (
        <Box sx={{ height: '100%', bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ textAlign: 'center', p: 1 }}>{movie.title}</Typography>
        </Box>
      )}

      <IconButton
        className="delete-btn"
        aria-label={`Remove ${movie.title} from the list`}
        onClick={() => onDelete(movie.id)}
        disabled={isDeleting}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'error.dark',
          color: 'common.white',
          opacity: 0,
          transition: (theme) => theme.transitions.create('opacity', {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': { bgcolor: 'error.main' },
          '@media (hover: none)': { opacity: 1 },
        }}
      >
        {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
      </IconButton>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.8)', color: 'common.white', p: 1.5, textAlign: 'center' }}>
        <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 'bold' }}>
          {movie.title}
        </Typography>
      </Box>
    </Card>
  )
}