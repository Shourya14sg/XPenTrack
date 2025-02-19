import { useState } from 'react'
import './App.css'
import { Route ,Routes } from 'react-router-dom'
import { Login } from './Pages'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/login' element={<Login/>} ></Route>
        <Route path='/dashboard' element={<Dashboard/>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
