import './App.css'
import { Navigate, Route ,Routes  } from 'react-router-dom'
import Login from './LoginPage/Login.jsx'
import Signup from './LoginPage/Signup.jsx'
import {Dashboard} from './Pages/Dashboard.jsx'
import LandingPage from './LandingPage/LandingPage.jsx'

function App() {
  const checkauth = () => {

    const user_data = JSON.parse(sessionStorage.getItem('user_data'))
    return user_data?.refresh && user_data?.access;
  } 

  const ProtectedRoute = ({ element }) => {
    return checkauth() ? element : <Navigate to="/login"  />;
  };

  return (
    <div className='overflow-hidden'>
      <Routes>
        <Route path='/' element={<LandingPage/>} ></Route>
        <Route path='/login' element={/*checkauth() ? <Navigate to="/dashboard" replace /> : */<Login />} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/dashboard/*' element={<ProtectedRoute element={<Dashboard/>}/>} ></Route>
      
      </Routes>
      </div>
  )
}
export const logout=()=>{
  const navigate=useNavigate();
  sessionStorage.removeItem("user_data")
  navigate('/', { replace: true }); 
  return <Navigate to="/" replace />
};
export default App
