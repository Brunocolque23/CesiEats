import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile/Profile'
import Parrainer from './pages/Parrainer/Parrainer'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Accept from './pages/Accept/Accept'
import Orders from './pages/Orders/Orders'
import Statistiques from './pages/Statistiques/Statistiques'
import Historique from './pages/Historique/Historique'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='app'>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/list" element={<List/>}/>
          <Route path="/accept" element={<Accept/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/historique" element={<Historique/>}/>
          <Route path="/parrainer" element={<Parrainer/>}/>
          <Route path="/statistiques" element={<Statistiques/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
