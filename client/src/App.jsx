import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import CompleteProfile from './pages/CompleteProfile'
import CreateComplaint from './pages/CreateComplaint'
import ViewComplaints from './pages/ViewComplaints'
import ProtectedRoute from './components/ProtectedRoute'
import StudentRoute from './components/StudentRoute'




export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route element={<Layout />}>
        <Route path="/"                 element={<Home />} />
         <Route path="/register"         element={<Register/>}/>
         <Route path='/login'      element={<Login/>}/>
         <Route path='/verify-email'  element={<VerifyEmail/>}/>
         <Route path='/complete-profile' element={<CompleteProfile/>}/>
         <Route path='/create-complaint' element={<ProtectedRoute><StudentRoute><CreateComplaint/></StudentRoute></ProtectedRoute>}/>
         <Route path='/view-complaints'  element={<ProtectedRoute><ViewComplaints/></ProtectedRoute>}/>
        
          </Route>
        
       
          
          
       

      </Routes>
    </BrowserRouter>
  )
}