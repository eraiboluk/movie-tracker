import { createTheme } from '@mui/material/styles'
import './theme.types'

export const goldenCinema = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fcfcfc',
      light: '#ffffff',
      dark: '#c9c9c9',
      contrastText: '#2d1f0e',
    },
    secondary: {
      main: '#d4a853',
      light: '#e6c47a',
      dark: '#a17d2f',
      contrastText: '#1a1207',
    },
    background: {
      default: '#7a5e33',
      paper: '#a79353',
    },
    text: {
      primary: '#fcfcfc',
      secondary: 'rgba(252, 252, 252, 0.7)',
    },
    error: {
      main: '#f44336',
      dark: '#d32f2f',
    },
    divider: 'rgba(252, 252, 252, 0.15)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    caption: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 4,
  },
  custom: {
    card: {
      popularMovie: { width: 150, height: 225 },
      myMovieGridMinWidth: '150px',
      borderRadius: 2,
      titleOverlayBg: 'rgba(0, 0, 0, 0.8)',
    },
    searchResult: {
      avatar: { width: 50, height: 75, borderRadius: 1 },
    },
    search: {
      maxWidth: 600,
      inputBorderRadius: 8,
    },
  },
})
