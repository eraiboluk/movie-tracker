import { Autocomplete, TextField, InputAdornment, Alert, Snackbar } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { MovieSearchResultItem } from './MovieSearchResultItem'

export function MovieSearch() {
  const {
    input,
    setInput,
    movies,
    isFetching,
    isSearchError,
    addMovie,
    addingMovieId,
    snackbar,
    closeSnackbar,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
  } = useMovieSearch()

  return (
    <>
      <Autocomplete
        freeSolo
        options={movies}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.title
        }
        inputValue={input}
        onInputChange={(_e, value, reason) => {
          if (reason !== 'reset') setInput(value)
        }}
        filterOptions={(x) => x}
        loading={isFetching}
        loadingText="Searching..."
        noOptionsText="No results found"
        slotProps={{
          listbox: {
            onScroll: (event: React.SyntheticEvent) => {
              const listbox = event.currentTarget
              if (
                hasNextPage &&
                !isFetchingNextPage &&
                listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 50
              ) {
                fetchNextPage()
              }
            },
          },
        }}
        renderOption={(_props, movie) => {
          const { key, ...rest } = _props
          return (
            <MovieSearchResultItem
              key={key}
              liProps={rest}
              movie={movie}
              isAdding={addingMovieId === movie.tmdbId}
              onAdd={addMovie}
            />
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for movies..."
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 8,
                  bgcolor: 'background.paper',
                  '& fieldset': { border: 'none' },
                  boxShadow: 1,
                },
              },
            }}
          />
        )}
        sx={{ maxWidth: 600, mx: 'auto' }}
      />
      {isSearchError && (
        <Alert severity="error" sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}>
          An error occurred while searching. Please try again.
        </Alert>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}