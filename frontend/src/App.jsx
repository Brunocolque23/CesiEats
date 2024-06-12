import React, { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';

import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import { ToastContainer, toast } from 'react-toastify'; // Importa 'toast'
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import User from './pages/User/User';
import { ResetPassword } from './pages/User/ResetPassword';
/////// Restaurateur
import Navbar2 from './components/Restaurant/Navbar/Navbar';
import Profile2 from './pages/Restaurant/Profile/Profile';
import Parrainer2 from './pages/Restaurant/Parrainer/Parrainer';
import Add2 from './pages/Restaurant/Add/Add';
import List2 from './pages/Restaurant/List/List';
import Accept2 from './pages/Restaurant/Accept/Accept';
import Orders2 from './pages/Restaurant/Orders/Orders';
import Statistiques2 from './pages/Restaurant/Statistiques/Statistiques';
import Historique2 from './pages/Restaurant/Historique/Historique';
import Sidebar2 from './components/Restaurant/Sidebar/Sidebar';
////Livreur
import Navbar3 from './components/Livreur/Navbar/Navbar';
import Profile3 from './pages/Livreur/Profile/Profile'
import Parrainer3 from './pages/Livreur/Parrainer/Parrainer'
import Accept3 from './pages/Livreur/Accept/Accept'
import Orders3 from './pages/Livreur/Orders/Orders'
import Statistiques3 from './pages/Livreur/Statistiques/Statistiques'
import Historique3 from './pages/Livreur/Historique/Historique'
import Sidebar3 from './components/Livreur/Sidebar/Sidebar';
////Service Commercial
import Navbar4 from './components/ServiceCommercial/Navbar/Navbar';
import Sidebar4 from './components/ServiceCommercial/Sidebar/Sidebar';
import Add4 from './pages/ServiceCommercial/Add/Add';
import List4 from './pages/ServiceCommercial/List/List';
import Orders4 from './pages/ServiceCommercial/Orders/Orders';
////Service Technique
import Navbar5 from './components/ServiceTechnique/Navbar/Navbar';
import Sidebar5 from './components/ServiceTechnique/Sidebar/Sidebar';
import Add5 from './pages/ServiceTechnique/Add/Add';
import List5 from './pages/ServiceTechnique/List/List';
import Orders5 from './pages/ServiceTechnique/Orders/Orders';


const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        
        console.log("Role:", userRole);
        setRole(userRole);
        

        // Muestra un mensaje de alerta con el rol del usuario

    }, []);

    return (
        <>
            <ToastContainer />
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
            <div className='app'>
                <Navbar setShowLogin={setShowLogin} />
                {role !== 'restaurateur' && role !== 'deliverer' && role !== 'servicetechnique' && role !== 'serviceCommercial' &&<Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<PlaceOrder />} />
                    <Route path='/myorders' element={<MyOrders />} />
                    <Route path='/api/user/details' element={<User />} />
                    <Route path='/verify' element={<Verify />} />
                    <Route path='/resetPassword/:token' element={<ResetPassword />} />
                </Routes>}
            </div>
            {role === 'restaurateur' && <div className='app2'>
                <Navbar2 />
                <hr />
                <div className="app-content">
                    {role === 'restaurateur' && <Sidebar2 />}
                    {role === 'restaurateur' && <Routes>
                        <Route path="/profile" element={<Profile2 />} />
                        <Route path="/add" element={<Add2 />} />
                        <Route path="/list" element={<List2 />} />
                        <Route path="/accept" element={<Accept2 />} />
                        <Route path="/orders" element={<Orders2 />} />
                        <Route path="/historique" element={<Historique2 />} />
                        <Route path="/parrainer" element={<Parrainer2 />} />
                        <Route path="/statistiques" element={<Statistiques2 />} />
                    </Routes>}
                </div>
            </div>}
            {role === 'deliverer' && <div className='app2'>
            <Navbar3 />
                <hr />
                <div className="app-content">
                    {role === 'deliverer' && <Sidebar3 />}
                    {role === 'deliverer' && <Routes>
                        <Route path="/profile" element={<Profile3 />} />
                        <Route path="/accept" element={<Accept3 />} />
                        <Route path="/orders" element={<Orders3 />} />
                        <Route path="/historique" element={<Historique3 />} />
                        <Route path="/parrainer" element={<Parrainer3 />} />
                        <Route path="/statistiques" element={<Statistiques3 />} />
                    </Routes>}
                </div>
            </div>}
            {role === 'servicetechnique' && <div className='app2'>
                <Navbar4 />
                <hr />
                <div className="app-content">
                    {role === 'servicetechnique' && <Sidebar4 />}
                    {role === 'servicetechnique' && <Routes>
                        <Route path="/add" element={<Add4/>}/>
                        <Route path="/list" element={<List4/>}/>
                        <Route path="/orders" element={<Orders4/>}/>
                    </Routes>}
                </div>
            </div>}
            {role === 'serviceCommercial' && <div className='app2'>
                <Navbar5 />
                <hr />
                <div className="app-content">
                    {role === 'serviceCommercial' && <Sidebar5 />}
                    {role === 'serviceCommercial' && <Routes>
                        <Route path="/add" element={<Add5/>}/>
                        <Route path="/list" element={<List5/>}/>
                        <Route path="/orders" element={<Orders5/>}/>
                    </Routes>}
                </div>
            </div>}
            <Footer />
        </>
    )
}

export default App;
