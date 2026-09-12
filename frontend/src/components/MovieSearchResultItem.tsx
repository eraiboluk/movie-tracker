import { useNavigate } from 'react-router-dom'
import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import { getPosterUrl } from '../api/movies'
import type { TmdbMovie } from '../api/movies'
import { SEARCH_RESULT_POSTER_SIZE } from '../constants'

interface MovieSearchResultItemProps {
  movie: TmdbMovie
  isAdding: boolean
  onAdd: (movie: TmdbMovie) => void
  liProps?: React.HTMLAttributes<HTMLLIElement>
}

export function MovieSearchResultItem({ movie, isAdding, onAdd, liProps }: MovieSearchResultItemProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const posterUrl = getPosterUrl(movie.posterPath, SEARCH_RESULT_POSTER_SIZE)

  return (
    <ListItemButton
      component="li"
      {...liProps}
      divider
      disabled={isAdding}
      onClick={(e) => {
        if (liProps?.onClick) liProps.onClick(e)
        navigate(`/movie/${movie.tmdbId}`)
      }}
    >
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={posterUrl ?? undefined}
          alt={movie.title}
          sx={{
            width: theme.custom.searchResult.avatar.width,
            height: theme.custom.searchResult.avatar.height,
            borderRadius: theme.custom.searchResult.avatar.borderRadius,
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={movie.title}
        secondary={movie.releaseDate?.split('-')[0]}
        slotProps={{ primary: { noWrap: true, sx: { fontWeight: 500 } } }}
      />
      <IconButton
        aria-label={`Add ${movie.title}`}
        onClick={(e) => { e.stopPropagation(); onAdd(movie) }}
        disabled={isAdding}
        sx={{
          bgcolor: 'primary.dark',
          color: 'common.white',
          '&:hover': { bgcolor: 'primary.main' },
        }}
      >
        {isAdding ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
      </IconButton>
    </ListItemButton>
  );
}