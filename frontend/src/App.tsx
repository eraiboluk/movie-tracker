import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { MovieDetails } from './pages/MovieDetails'
import { Auth } from './pages/Auth'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App