import { Box, Container, Typography } from '@mui/material'
import { MovieSearch } from './components/MovieSearch'
import { PopularMovies } from './components/PopularMovies'
import { MyMovies } from './components/MyMovies'

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom color="primary.main">
        Movie Tracker
      </Typography>

      <Box sx={{ mb: 6, position: 'relative', zIndex: 20 }}>
        <MovieSearch />
      </Box>

      <Box sx={{ mb: 6, position: 'relative', zIndex: 10 }}>
        <Typography variant="h5" fontWeight="600" mb={3} color="text.primary">
          Popular Films
        </Typography>
        <PopularMovies />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Typography variant="h5" fontWeight="600" mb={3} color="text.primary">
          My List
        </Typography>
        <MyMovies />
      </Box>
    </Container>
  )
}

export default App