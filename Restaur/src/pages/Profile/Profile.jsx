import React, { useState } from 'react';
import './Profile.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const [data, setData] = useState({
        id: "",  // Agrega el ID del restaurante si es necesario
        name: "",
        email: "",
        password: "",
        localisation: "",
        phone: "",
        newName: "",
        newPassword: "",
        newEmail: "",
        newAddress: ""
    });

    const [image, setImage] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("localisation", data.localisation);
        formData.append("phone", data.phone);
        const response = await axios.post(`${url}/api/restaurant/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({
                id: "",
                name: "",
                email: "",
                password: "",
                localisation: "",
                phone: "",
                newName: "",
                newPassword: "",
                newEmail: "",
                newAddress: ""
            });
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const handleDeleteClick = () => {
        const confirmation = window.confirm("Are you sure?");
        if (confirmation) {
            alert("Deleted!");
        } else {
            alert("Not deleted!");
        }
    };

    const handleUpdateClick = async () => {
        const response = await axios.put(`${url}/api/restaurant/update`, {
            id: data.id,
            name: data.newName || data.name,
            password: data.newPassword || data.password,
            email: data.newEmail || data.email,
            localisation: data.newAddress || data.localisation,
            phone: data.phone
        });
        if (response.data.success) {
            toast.success(response.data.message);
            // Actualizar los campos del formulario con los nuevos datos
            setData({
                ...data,
                name: data.newName || data.name,
                password: data.newPassword || data.password,
                email: data.newEmail || data.email,
                localisation: data.newAddress || data.localisation,
                newName: "",
                newPassword: "",
                newEmail: "",
                newAddress: ""
            });
        } else {
            toast.error(response.data.message);
        }
    };

    return (
        <div className='profile'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='profile-img-upload flex-col'>
                    <p>Logo</p>
                    <label htmlFor="image">
                        <img src="/src/assets/Bembos.png" alt="" />
                    </label>    
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Restaurant Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled/>
                </div>

                <div className="d-flex justify-content-between">
                    <div className="profile-section">
                        <div className='profile-product-name flex-col'>
                            <p>Name</p>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled />
                            <input name='newName' onChange={onChangeHandler} value={data.newName} type="text" placeholder='Enter new name' />
                        </div>
                    </div>
                    <div className="profile-section">
                        <div className='profile-product-name flex-col text-center'>
                            <p>Password</p>
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter current password' required />
                            <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='Enter new password' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Email</p>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='bruno@viacesi.fr' required />
                            <input name='newEmail' onChange={onChangeHandler} value={data.newEmail} type="email" placeholder='Enter new email' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Address</p>
                            <input name='localisation' onChange={onChangeHandler} value={data.localisation} type="text" placeholder='1 Av Jacques Chirac' required />
                            <input name='newAddress' onChange={onChangeHandler} value={data.newAddress} type="text" placeholder='Enter new address' />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit" className="btn btn-primary profile-btn">PROFILE</button>
                    <button type="button" className="btn btn-secondary profile-btn" onClick={handleUpdateClick}>UPGRADE</button>
                    <button type="button" className="btn btn-danger profile-btn" onClick={handleDeleteClick}>DELETE</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
