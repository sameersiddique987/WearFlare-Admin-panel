import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://wear-flare-backend.vercel.app/api/v1/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div>Loading orders...</div>;

  if (!token) return <div>Please login to view your orders.</div>;

  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-3 mb-4 shadow-sm rounded">
          <div className="mb-2">
            <strong>Order ID:</strong> {order._id}
          </div>
          <div className="mb-2">
            <strong>Status:</strong> <span className="badge bg-info">{order.status}</span>
          </div>
          <div className="mb-2">
            <strong>Total Amount:</strong> ${order.totalAmount}
          </div>
          <div>
            <strong>Products:</strong>
            <ul>
              {order.products.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> | Size: {item.size} | Qty: {item.quantity} | Price: ${item.price}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-muted mt-2">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home