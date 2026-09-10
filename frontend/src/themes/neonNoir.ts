import { createTheme } from '@mui/material/styles'
import './theme.types'

export const neonNoir = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e040fb',
      light: '#ea80fc',
      dark: '#aa00ff',
      contrastText: '#0a0a0a',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b388ff',
      dark: '#651fff',
      contrastText: '#0a0a0a',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#f0e6ff',
      secondary: 'rgba(240, 230, 255, 0.6)',
    },
    error: {
      main: '#ff1744',
      dark: '#d50000',
    },
    divider: 'rgba(224, 64, 251, 0.15)',
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", "Inter", monospace',
    h3: { fontWeight: 800 },
    h5: { fontWeight: 700 },
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
      titleOverlayBg: 'rgba(10, 10, 10, 0.9)',
    },
    searchResult: {
      avatar: { width: 50, height: 75, borderRadius: 1 },
    },
    search: {
      maxWidth: 600,
      inputBorderRadius: 12,
    },
  },
})
