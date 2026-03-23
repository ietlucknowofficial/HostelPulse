import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route element={<Layout />}>
        <Route path="/"                 element={<Home />} />
        
        
          
          
        </Route>

      </Routes>
    </BrowserRouter>
  )
}