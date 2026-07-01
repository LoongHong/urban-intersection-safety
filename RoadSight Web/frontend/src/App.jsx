import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predictor from './pages/Predictor'
import ModelPerformance from './pages/ModelPerformance'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/models" element={<ModelPerformance />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
