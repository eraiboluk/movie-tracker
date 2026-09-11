import { Box, Container, Typography } from '@mui/material'
import { MovieSearch } from '../components/MovieSearch'
import { PopularMovies } from '../components/PopularMovies'
import { MyMovies } from '../components/MyMovies'

export function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '100vh' }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "primary.main"
        }}>
        Movie Tracker
      </Typography>

      <Box sx={{ mb: 6, position: 'relative', zIndex: 20 }}>
        <MovieSearch />
      </Box>

      <Box sx={{ mb: 6, position: 'relative', zIndex: 10 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: "text.primary"
          }}>
          Popular Films
        </Typography>
        <PopularMovies />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: "text.primary"
          }}>
          My List
        </Typography>
        <MyMovies />
      </Box>
    </Container>
  )
}
