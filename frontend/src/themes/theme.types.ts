import '@mui/material/styles'

export interface CustomTokens {
  card: {
    popularMovie: {
      width: number
      height: number
    }
    myMovieGridMinWidth: string
    borderRadius: number
    titleOverlayBg: string
  }
  searchResult: {
    avatar: {
      width: number
      height: number
      borderRadius: number
    }
  }
  search: {
    maxWidth: number
    inputBorderRadius: number
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    custom: CustomTokens
  }
  interface ThemeOptions {
    custom?: CustomTokens
  }
}
