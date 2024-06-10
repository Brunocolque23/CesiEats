import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css'; // Asegúrate de tener tu archivo CSS adecuadamente

const APIList = () => {
  const [apis, setAPIs] = useState([]);

  const fetchAllAPIs = async () => {
    try {
      const response = await axios.get(`${url}/api/apis/listAPI`);
      if (response.data.success) {
        setAPIs(response.data.data.reverse());
      } else {
        toast.error("Error fetching APIs");
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
      toast.error("Error fetching APIs");
    }
  };

  useEffect(() => {
    fetchAllAPIs();
  }, []);

  return (
    <div className="api-list-container">
      <h3>APIs List</h3>
      <div className="api-list">
        {apis.map((api, index) => (
          <div key={index} className="api-item">
            <img src={api.image} alt={api.name} />
            <div>
              <p className="api-name">{api.name}</p>
              <p className="api-secret-key">Secret Key: {api.secretKey}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIList;
