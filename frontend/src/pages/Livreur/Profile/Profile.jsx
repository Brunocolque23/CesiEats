import React, { useState, useEffect } from 'react';
import './Profile.css';
import { url } from '../../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const [data, setData] = useState({
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

    const [image, setImage] = useState(false);

    useEffect(() => {
        const fetchlivreurData = async () => {
            try {
                const response = await axios.post(`${url}/api/livreur/findByName`, { name: "Jorge Colque" });
                if (response.data.success) {
                    const livreurData = response.data.data;
                    setData({
                        id: livreurData._id,
                        name: livreurData.name,
                        email: livreurData.email,
                        password: livreurData.password,
                        localisation: livreurData.localisation,
                        phone: livreurData.phone
                    });
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching livreur data:", error);
                toast.error("Error fetching livreur data");
            }
        };
        fetchlivreurData();
    }, []); // This effect runs only once on component mount

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        // Your form submission logic here
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
        // Your update logic here
    };

    return (
        <div className='profile'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='profile-img-upload flex-col'>
                    <p>Photo</p>
                    <label htmlFor="image">
                        <img src="/src/assets/Profile.jpg" alt="" />
                    </label>    
                </div>
                <div className='profile-product-name flex-col'>
                    <p>livreur Name</p>
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
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='bruno@viacesi.fr' required disabled />
                            <input name='newEmail' onChange={onChangeHandler} value={data.newEmail} type="email" placeholder='Enter new email' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Address</p>
                            <input name='localisation' onChange={onChangeHandler} value={data.localisation} type="text" placeholder='1 Av Jacques Chirac' required disabled />
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
