import { createTheme } from '@mui/material/styles'
import './theme.types'

export const arcticFrost = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0',
      light: '#1e88e5',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#42a5f5',
      light: '#64b5f6',
      dark: '#1e88e5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2027',
      secondary: 'rgba(26, 32, 39, 0.6)',
    },
    error: {
      main: '#d32f2f',
      dark: '#b71c1c',
    },
    divider: 'rgba(21, 101, 192, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    caption: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  custom: {
    card: {
      popularMovie: { width: 150, height: 225 },
      myMovieGridMinWidth: '150px',
      borderRadius: 3,
      titleOverlayBg: 'rgba(26, 32, 39, 0.75)',
    },
    searchResult: {
      avatar: { width: 50, height: 75, borderRadius: 1 },
    },
    search: {
      maxWidth: 600,
      inputBorderRadius: 6,
    },
  },
})
