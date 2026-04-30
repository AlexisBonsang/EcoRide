// library
import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './components/contexts/AuthContext'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Landing from './components/pages/Landing'
import OAuthCallback from './components/pages/OAuthCallback'
import Register from './components/pages/Register'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RequireProfileComplete from './components/auth/RequireProfileComplete'
import RequireAdmin from './components/auth/RequireAdmin'
import Profile from './components/pages/Profile'
import Cars from './components/pages/Cars'
import ForgotPassword from './components/pages/ForgotPassword'
import ResetPassword from './components/pages/ResetPassword'
import VerifyEmail from './components/pages/VerifyEmail'
import AdminPanel from './components/pages/admin/AdminPanel'
import Layout from './Layouts/Layouts'
import ComingSoon from './components/pages/ComingSoon'

const CLIENT_ID = "271026074312-820a0c5v4s0j7ve3i6ubo26fea1b0fi0.apps.googleusercontent.com"

function AppRoutes() {
  const { loading } = useAuth()
  if (loading) return null

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/landing" element={<ProtectedRoute><RequireProfileComplete><Landing /></RequireProfileComplete></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><RequireProfileComplete><Profile /></RequireProfileComplete></ProtectedRoute>} />
        <Route path="/my-cars" element={<ProtectedRoute><RequireProfileComplete><Cars /></RequireProfileComplete></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute><RequireAdmin><AdminPanel /></RequireAdmin></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><RequireProfileComplete><ComingSoon /></RequireProfileComplete></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
