import './App.css'

import { Route, Routes } from 'react-router-dom'

import Auth from './views/Auth'
import Register from './views/Register'
import Login from './views/Login'
import TodoList from './views/TodoList'


function App() {

  return (
    <>
      <Routes>
        <Route path="/auth" element={ <Auth /> }>
          <Route path="register" element={ <Register /> } />
          <Route path="login" element={ <Login /> } />
        </Route>
        <Route path="/todo" element={ <TodoList /> }/>
      </Routes>
    </>
  )
}

export default App
