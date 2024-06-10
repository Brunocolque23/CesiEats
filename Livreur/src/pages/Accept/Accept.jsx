import React, { useEffect, useState } from 'react';
import './Accept.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';
import QRCode from 'qrcode.react';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list3`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error('Error');
      }
    } catch (error) {
      toast.error('Error fetching orders');
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: status,
      });
      if (response.data.success) {
        await fetchAllOrders();
        if (status === 'Food Processing2') {
          setSelectedOrder(orderId); // Establece el pedido seleccionado después de aceptarlo
        }
        toast.success(`Order ${orderId} ${status === 'Accepted' ? 'accepted' : 'rejected'}`);
      } else {
        toast.error(`Error updating order ${orderId}`);
      }
    } catch (error) {
      toast.error(`Error updating order ${orderId}`);
      console.error(error);
    }
  };

  const receiveOrder = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/receive`, { orderId });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order received successfully');
      } else {
        toast.error('Error receiving order');
      }
    } catch (error) {
      toast.error('Error receiving order');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getQRCodeValue = (order) => {
    return `${order._id} ${order.address.firstName} ${order.address.lastName}, ${order.address.city}`;
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
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
            <div className='order-actions'>
              {order.status === 'Waiting for Livreur' && (
                <>
                  <button
                    className='custom-btn accept-btn'
                    onClick={() => updateOrderStatus(order._id, 'Food Processing2')}
                  >
                    Accept
                  </button>
                  <button
                    className='custom-btn reject-btn'
                    onClick={() => updateOrderStatus(order._id, 'Rejected by Restaurant')}
                  >
                    Reject
                  </button>
                </>
              )}
              {order.status === 'Food Processing2' && (
                <button
                  className='custom-btn receive-btn'
                  onClick={() => updateOrderStatus(order._id, 'On our way')}
                >
                  Received
                </button>
              )}
              {order.status === 'On our way' && (
                <button
                  className='custom-btn ouw-btn'
                  onClick={() => updateOrderStatus(order._id, 'Delivered')}
                >
                  Delivered
                </button>
              )}
            </div>
            {/* Muestra el QR si el pedido está en "Food Processing2" */}
            {order.status === 'Food Processing2' || order.status === 'On our way' ? (
                <div className='qr-container'>
                  <h4>QR Code</h4>
                  <QRCode value={getQRCodeValue(order)} />
                </div>
              ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;

