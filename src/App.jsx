// library
import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './components/contexts/AuthContext'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Landing from './components/pages/Landing'
import OAuthCallback from './components/pages/OAuthCallback'
import Register from './components/pages/Register'
import Layout from './Layouts/Layouts'

const CLIENT_ID = "271026074312-820a0c5v4s0j7ve3i6ubo26fea1b0fi0.apps.googleusercontent.com"

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
