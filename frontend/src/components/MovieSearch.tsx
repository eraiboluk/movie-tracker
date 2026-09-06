import { useEffect, useRef, useState } from 'react'
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  Alert
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { MovieSearchResultItem } from './MovieSearchResultItem'

export function MovieSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    input,
    setInput,
    movies,
    isFetching,
    isSearchError,
    addMovie,
    addingMovieId,
    addError,
  } = useMovieSearch()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showDropdown = isOpen && input.trim().length > 0

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        placeholder="Search for movies..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false)
        }}
        variant="outlined"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="movie-search-results"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: isFetching ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null,
          sx: {
            borderRadius: 8,
            bgcolor: 'background.paper',
            '& fieldset': { border: 'none' },
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }
        }}
      />

      {isSearchError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      )}

      {showDropdown && (
        <Paper
          id="movie-search-results"
          role="listbox"
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflowY: 'auto',
            borderRadius: 4,
            zIndex: 10,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            bgcolor: 'background.paper'
          }}
        >
          {movies.length === 0 && !isFetching ? (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              Sonuç bulunamadı
            </Typography>
          ) : (
            movies.map((movie) => (
              <MovieSearchResultItem
                key={movie.tmdbId}
                movie={movie}
                isAdding={addingMovieId === movie.tmdbId}
                onAdd={addMovie}
              />
            ))
          )}
        </Paper>
      )}

      {addError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Film eklenirken bir hata oluştu.
        </Alert>
      )}
    </Box>
  )
}