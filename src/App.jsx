// library
import { Routes, Route } from 'react-router-dom'

// routes
import Home from './components/pages/Home'
import Login from './components/pages/Login'





function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
