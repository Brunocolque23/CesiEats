import React, { useEffect, useState } from 'react';
import './Accept.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list2`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: status
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(`Order ${orderId} ${status === 'Accepted' ? 'accepted' : 'rejected'}`);
      } else {
        toast.error(`Error updating order ${orderId}`);
      }
    } catch (error) {
      toast.error(`Error updating order ${orderId}`);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} x {item.quantity}
                    {index < order.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p className='order-item-name'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <div className="order-actions">
              <button className="custom-btn accept-btn" onClick={() => updateOrderStatus(order._id, 'Waiting for Livreur')}>Accept</button>
              <button className="custom-btn reject-btn" onClick={() => updateOrderStatus(order._id, 'Rejected by Restaurant')}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
