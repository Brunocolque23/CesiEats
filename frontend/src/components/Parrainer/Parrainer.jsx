import React from 'react'
import './Parrainer.css'
import { assets } from '../../assets/assets'
import { useState } from 'react';

const Parrainer = () => {
    const [restaurant, setRestaurant] = useState({
        name: '',
        location: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurant({
            ...restaurant,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Restaurant recommended:', restaurant);
        // Aquí puedes agregar la lógica para manejar el envío del formulario
    }

    return (
        <div className='parrainer' id='parrainer'>
            <h1>Parrainer votre restaurant</h1>
            
            <div className="parrainer-platforms">
                
            </div>
            
            <div className="parrainer-content">
                <div className="parrainer-image">
                    <img src={assets.parrainer} alt="parrainer" />
                </div>
                
                <form onSubmit={handleSubmit} className="restaurant-form">
                    <div>
                        <label htmlFor="name">Nom du restaurant:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={restaurant.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Localisation du Restaurant:</label>
                        <input 
                            type="text" 
                            id="location" 
                            name="location" 
                            value={restaurant.location} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Numéro de téléphone:</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={restaurant.phone} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Courrier électronique:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={restaurant.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit">Recommander le restaurant</button>
                </form>
            </div>
        </div>
    )
}

export default Parrainer;
