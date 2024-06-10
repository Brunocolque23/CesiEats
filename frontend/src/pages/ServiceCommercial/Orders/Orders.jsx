import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, url } from '../../../assets/assets';

const APIList = () => {
    const [apis, setApis] = useState([]);

    const fetchAllAPIs = async () => {
        try {
            const response = await axios.get(`${url}/api/apis/listAPI`);
            if (response.data.success) {
                setApis(response.data.data.reverse());
            } else {
                toast.error("Failed to fetch APIs");
            }
        } catch (error) {
            console.error("Error fetching APIs:", error);
            toast.error("Failed to fetch APIs");
        }
    };

    useEffect(() => {
        fetchAllAPIs();
    }, []);

    return (
        <div className='order add'>
            <h3>API List</h3>
            <div className="api-list">
                {apis.map(api => (
                    <div key={api._id} className="api-item">
                        <img src={api.image} alt={api.name} />
                        <div>
                            <p className="api-name">{api.name}</p>
                            <p className="api-secret">Secret Key: {api.secretKey}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="add-api-btn" onClick={() => {/* Function to add new APIs */}}>Add API</button>
        </div>
    );
};

export default APIList;
