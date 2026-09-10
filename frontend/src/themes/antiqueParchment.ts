import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/700.css'
import { createTheme } from '@mui/material/styles'
import './theme.types'

export const antiqueParchment = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4c5a9',
      light: '#e8dcc6',
      dark: '#a89470',
      contrastText: '#1c1510',
    },
    secondary: {
      main: '#8b6914',
      light: '#b8922e',
      dark: '#6b4f0e',
      contrastText: '#f5efe3',
    },
    background: {
      default: '#1c1510',
      paper: '#2a211a',
    },
    text: {
      primary: '#e8dcc6',
      secondary: 'rgba(232, 220, 198, 0.6)',
    },
    error: {
      main: '#c0392b',
      dark: '#922b21',
    },
    divider: 'rgba(212, 197, 169, 0.12)',
  },
  typography: {
    fontFamily: '"Merriweather", serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    caption: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 4,
  },
  custom: {
    card: {
      popularMovie: { width: 150, height: 225 },
      myMovieGridMinWidth: '150px',
      borderRadius: 1,
      titleOverlayBg: 'rgba(28, 21, 16, 0.85)',
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
