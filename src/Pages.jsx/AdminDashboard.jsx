import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const dummySalesStats = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3200 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 6200 },
    { month: "May", sales: 4500 },
  ];

  const dummyTopProducts = [
    { name: "Hoodie", orders: 120 },
    { name: "T-Shirt", orders: 95 },
    { name: "Shirt", orders: 78 },
    { name: "Jacket", orders: 60 },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://wear-flare-backend.vercel.app/api/v1/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
    else setLoading(false);
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (!token) return <div className="text-center py-10">Please login to access admin dashboard.</div>;

  const stats = [
    { label: "Total Orders", value: orders.length },
    {
      label: "Total Revenue",
      value: `$${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}`
    },
    { label: "Total Users", value: "893+" }, // dummy
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">📊 Admin Dashboard</h2>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="text-gray-500 text-sm mb-2">{stat.label}</h4>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">📈 Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummySalesStats}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">🔥 Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyTopProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold mb-4">🧾 Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2">{order._id}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>${order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.products.reduce((acc, item) => acc + item.quantity, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
