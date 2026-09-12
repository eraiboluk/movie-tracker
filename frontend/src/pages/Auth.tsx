import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Fade, Alert, Link, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { login, registerUser, setAuthToken } from '../api/auth'
import { UI, AUTH_PASSWORD_MIN_LENGTH } from '../constants'
import { useQueryClient } from '@tanstack/react-query'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const passwordRequirements = [
    { label: `At least ${AUTH_PASSWORD_MIN_LENGTH} characters`, test: (p: string) => p.length >= AUTH_PASSWORD_MIN_LENGTH },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character (!, @, #, etc.)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.test(password))
  const doPasswordsMatch = password === confirmPassword && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLogin) {
      if (!isPasswordValid) {
        setError('Please meet all password requirements before signing up.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const res = await login(email, password)
        setAuthToken(res.accessToken)
        queryClient.invalidateQueries()
        navigate('/')
      } else {
        await registerUser(email, password)
        const res = await login(email, password)
        setAuthToken(res.accessToken)
        queryClient.invalidateQueries()
        navigate('/')
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || (status === 400 && isLogin)) {
          setError('Invalid email or password.')
        } else {
          const responseData = err.response.data
          if (responseData?.errors) {
            const errorMessages = Object.values(responseData.errors).flat().join(' ')
            setError(errorMessages)
          } else {
            setError(responseData?.detail || responseData?.title || 'An error occurred during authentication.')
          }
        }
      } else if (err.request) {
        setError('Unable to connect to the server. Please check your connection and try again.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fade in={true} timeout={UI.PAGE_TRANSITION_DURATION_MS}>
      <Container maxWidth="xs" sx={{ py: 12 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }} gutterBottom>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isLogin ? 'Sign in to continue to Movie Tracker' : 'Join us to track your favorite movies'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!isLogin && (
              <>
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword.length > 0 && !doPasswordsMatch}
                  helperText={confirmPassword.length > 0 && !doPasswordsMatch ? "Passwords do not match" : ""}
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, textAlign: 'left', pl: 1 }}>
                  {passwordRequirements.map((req, idx) => {
                    const isValid = req.test(password)
                    return (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isValid ? (
                          <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                        ) : (
                          <CancelIcon color="error" sx={{ fontSize: 18 }} />
                        )}
                        <Typography variant="caption" color={isValid ? 'success.main' : 'error.main'}>
                          {req.label}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </>
            )}
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || (!isLogin && (!isPasswordValid || !doPasswordsMatch))}
              fullWidth
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Typography variant="body2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Fade>
  )
}
