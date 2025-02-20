import { useState } from 'react'
import './App.css'
import { Route ,Routes } from 'react-router-dom'
import { Dashboard } from './Pages'
function App() {
  const [count, setCount] = useState(0)

  return (
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>} ></Route>
      </Routes>
  )
}

export default App
