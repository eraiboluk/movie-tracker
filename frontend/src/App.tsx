import { Container, Typography, Divider } from '@mui/material'
import { PopularMovies } from './components/PopularMovies'
import { MovieSearch } from './components/MovieSearch'
import { MyMovies } from './components/MyMovies'

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Movie Tracker
      </Typography>

      <PopularMovies />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Search Films
      </Typography>
      <MovieSearch />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        My List
      </Typography>
      <MyMovies />
    </Container>
  )
}

export default App