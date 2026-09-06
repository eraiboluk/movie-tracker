import { Card, CardMedia, Box, Typography, IconButton, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { getPosterUrl } from '../api/movies'
import { DEFAULT_POSTER_SIZE } from '../constants'

interface MyMovie {
  id: number | string
  title: string
  posterPath: string | null
}

interface MovieCardProps {
  movie: MyMovie
  isDeleting: boolean
  onDelete: (id: MyMovie['id']) => void
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
          <Typography variant="caption" textAlign="center" p={1}>{movie.title}</Typography>
        </Box>
      )}

      <IconButton
        className="delete-btn"
        aria-label={`${movie.title} filmini listeden çıkar`}
        onClick={() => onDelete(movie.id)}
        disabled={isDeleting}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'error.dark',
          color: 'white',
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': { bgcolor: 'error.main' },
          // Touch cihazlarda gerçek "hover" olmadığı için buton hep görünür kalsın
          '@media (hover: none)': { opacity: 1 },
        }}
      >
        {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
      </IconButton>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.8)', color: 'white', p: 1.5, textAlign: 'center' }}>
        <Typography variant="caption" noWrap display="block" fontWeight="bold">
          {movie.title}
        </Typography>
      </Box>
    </Card>
  )
}