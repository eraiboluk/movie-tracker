import { Container, Typography, Divider } from '@mui/material'
import { MovieSearch } from './components/MovieSearch'
import { MyMovies } from './components/MyMovies'

function App() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Films</Typography>
      <MovieSearch />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>My List</Typography>
      <MyMovies />
    </Container>
  )
}

export default App