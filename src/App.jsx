// library
import { HashRouter, Routes, Route } from 'react-router-dom'

// routes
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Landing from './components/pages/Landing'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "271026074312-820a0c5v4s0j7ve3i6ubo26fea1b0fi0.apps.googleusercontent.com"

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Routes>
        {/* Ajout d'une route par page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
