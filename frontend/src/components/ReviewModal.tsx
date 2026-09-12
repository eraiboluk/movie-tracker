import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getPosterUrl } from '../api/movies'
import type { TmdbMovie } from '../api/movies'
import { DEFAULT_POSTER_SIZE, UI } from '../constants'

interface ReviewModalProps {
  movie: TmdbMovie
  open: boolean
  onClose: () => void
  onSave: (rating: number, watchedOn: string, comment?: string) => void
  isSaving: boolean
}

export function ReviewModal({ movie, open, onClose, onSave, isSaving }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [watchedOn, setWatchedOn] = useState(new Date().toISOString().split('T')[0])
  const [comment, setComment] = useState('')

  const posterUrl = getPosterUrl(movie.posterPath, DEFAULT_POSTER_SIZE)

  const handleClose = (_event: object, reason?: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose()
    }
  }

  const getRatingColor = (value: number) => {
    if (value <= 3) return 'error'
    if (value <= 6) return 'warning'
    return 'success'
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {movie.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
            <Box
              component="img"
              src={posterUrl ?? undefined}
              alt={movie.title}
              sx={{ width: '100%', borderRadius: 1 }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '67%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Rating
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {UI.ALLOWED_RATINGS.map((value) => (
                <Button
                  key={value}
                  variant={rating === value ? 'contained' : 'outlined'}
                  color={rating === value ? getRatingColor(value) : 'inherit'}
                  onClick={() => setRating(value)}
                  sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
                >
                  {value}
                </Button>
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Watched On
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={watchedOn}
              onChange={(e) => setWatchedOn(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Review
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: UI.REVIEW_MAX_CHARS,
                }
              }}
              helperText={`${comment.length} / ${UI.REVIEW_MAX_CHARS}`}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => onSave(rating, watchedOn, comment)}
          variant="contained"
          disabled={rating === 0 || !watchedOn || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
