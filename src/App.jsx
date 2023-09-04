import { Route, Routes, NavLink } from 'react-router-dom'

import Auth from './views/Auth'
import Register from './views/Register'
import Login from './views/Login'


function App() {

  return (
    <>
      <nav>導覽列
        <NavLink to="/auth/register">註冊</NavLink>
        <NavLink to="/auth/login">登入</NavLink>
      </nav>
      <Routes>
        <Route path="/auth" element={ <Auth /> }>
          <Route path="register" element={ <Register /> } />
          <Route path="login" element={ <Login /> } />
        </Route>
      </Routes>
    </>
  )
}

export default App
