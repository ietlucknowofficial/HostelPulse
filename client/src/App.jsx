import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import CompleteProfile from './pages/CompleteProfile'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route element={<Layout />}>
        <Route path="/"                 element={<Home />} />
         <Route path="/register"         element={<Register/>}/>
         <Route path='/login'      element={<Login/>}/>
         <Route path='verify-email'  element={<VerifyEmail/>}/>
         <Route path='complete-profile' element={<CompleteProfile/>}/>
        
        
       
          
          
        </Route>

      </Routes>
    </BrowserRouter>
  )
}