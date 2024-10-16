import Home from './pages/Home'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {

 
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/sign-up" exact element={<SignUp />} />
    </Routes>
     
    </BrowserRouter>
  )
}

export default App
