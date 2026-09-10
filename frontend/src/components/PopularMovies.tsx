import { useRef, useState, useCallback } from 'react'
import { Box, Card, CardMedia, Skeleton, Typography, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { getPosterUrl } from '../api/movies'
import { POPULAR_MOVIES_POSTER_SIZE, UI } from '../constants'
import { usePopularMovies } from '../hooks/usePopularMovies'
import type { TmdbMovie } from '../api/movies'

interface PopularMoviesProps {
  onMovieClick?: (movie: TmdbMovie) => void
}

export function PopularMovies({onMovieClick }: PopularMoviesProps) {
  const theme = useTheme()
  const { data: movies, isLoading } = usePopularMovies()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)

  }, [])

  const initScrollCheck = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      scrollRef.current = node
      setCanScrollRight(node.scrollWidth > node.clientWidth)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -el.clientWidth : el.clientWidth
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const { width: cardWidth, height: cardHeight } = theme.custom.card.popularMovie

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {Array.from({ length: UI.POPULAR_MOVIES_SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={cardWidth} height={cardHeight} sx={{ flexShrink: 0 }} />
        ))}
      </Box>
    )
  }

  if (!movies || movies.length === 0) return null

  return (
    <Box sx={{ position: 'relative' }}>
      {canScrollLeft && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'background.default' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box
        ref={initScrollCheck}
        onScroll={updateScrollButtons}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          py: 1,
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {movies.map((movie) => {
          const posterUrl = getPosterUrl(movie.posterPath, POPULAR_MOVIES_POSTER_SIZE)
          return (
            <Card
              key={movie.tmdbId}
              onClick={onMovieClick ? () => onMovieClick(movie) : undefined}
              sx={{
                width: cardWidth,
                height: cardHeight,
                flexShrink: 0,
                borderRadius: theme.custom.card.borderRadius,
                scrollSnapAlign: 'start',
                cursor: onMovieClick ? 'pointer' : 'default',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.standard,
                }),
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {posterUrl ? (
                <CardMedia component="img" height="100%" image={posterUrl} alt={movie.title} sx={{ objectFit: 'cover' }} />
              ) : (
                <Box sx={{ height: '100%', bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "center",
                      p: 1
                    }}>{movie.title}</Typography>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>

      {canScrollRight && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'background.default' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}