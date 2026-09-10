import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { createTheme } from '@mui/material/styles'
import './theme.types'

export const midnightOcean = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',
      light: '#90caf9',
      dark: '#1e88e5',
      contrastText: '#0a1628',
    },
    secondary: {
      main: '#26c6da',
      light: '#4dd0e1',
      dark: '#00838f',
      contrastText: '#0a1628',
    },
    background: {
      default: '#0b1622',
      paper: '#152238',
    },
    text: {
      primary: '#e1e8f0',
      secondary: 'rgba(225, 232, 240, 0.6)',
    },
    error: {
      main: '#ef5350',
      dark: '#c62828',
    },
    divider: 'rgba(100, 181, 246, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    caption: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 6,
  },
  custom: {
    card: {
      popularMovie: { width: 150, height: 225 },
      myMovieGridMinWidth: '150px',
      borderRadius: 2,
      titleOverlayBg: 'rgba(11, 22, 34, 0.85)',
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
