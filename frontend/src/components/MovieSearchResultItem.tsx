import { Box, Typography, IconButton, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getPosterUrl } from '../api/movies'
import type { TmdbMovie } from '../api/movies'
import { SEARCH_RESULT_POSTER_SIZE } from '../constants'

interface MovieSearchResultItemProps {
  movie: TmdbMovie
  isAdding: boolean
  onAdd: (movie: TmdbMovie) => void
}

export function MovieSearchResultItem({ movie, isAdding, onAdd }: MovieSearchResultItemProps) {
  const posterUrl = getPosterUrl(movie.posterPath, SEARCH_RESULT_POSTER_SIZE)

  return (
    <Box
      role="option"
      aria-selected={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      {posterUrl ? (
        <Box
          component="img"
          src={posterUrl}
          alt={movie.title}
          sx={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 1, mr: 2 }}
        />
      ) : (
        <Box sx={{ width: 50, height: 75, bgcolor: 'grey.800', borderRadius: 1, mr: 2 }} />
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" noWrap sx={{
          fontWeight: "500"
        }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{
          color: "text.secondary"
        }}>
          {movie.releaseDate?.split('-')[0]}
        </Typography>
      </Box>

      <IconButton
        aria-label={`Add ${movie.title} to the list`}
        onClick={() => onAdd(movie)}
        disabled={isAdding}
        sx={{
          bgcolor: 'primary.dark',
          color: 'white',
          '&:hover': { bgcolor: 'primary.main' }
        }}
      >
        {isAdding ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
      </IconButton>
    </Box>
  );
}