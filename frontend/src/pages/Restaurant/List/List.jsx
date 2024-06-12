import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const useremail = localStorage.getItem('email'); 
  const userename = localStorage.getItem('restaurantname');
  //toast.error(userename);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`, {
      params: { name: userename } // enviar el email como parámetro
    });
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Restaurant</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p>{item.restaurant}</p>
              <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
