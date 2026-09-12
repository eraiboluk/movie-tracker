import { Box, Container, Typography, Fade, Button } from '@mui/material'
import { MovieSearch } from '../components/MovieSearch'
import { PopularMovies } from '../components/PopularMovies'
import { MyMovies } from '../components/MyMovies'
import { UI } from '../constants'

import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { setAuthToken } from '../api/auth'

export function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    setAuthToken(null)
    queryClient.clear()
    navigate('/login')
  }

  return (
    <Fade in={true} timeout={UI.PAGE_TRANSITION_DURATION_MS}>
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            color: "primary.main",
            textAlign: "center"
          }}>
          Movie Tracker
        </Typography>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={handleLogout}
          sx={{ position: 'absolute', right: 0 }}
        >
          Logout
        </Button>
      </Box>

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
    </Fade>
  )
}
