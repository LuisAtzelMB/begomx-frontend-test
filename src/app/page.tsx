"use client";
import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming"
        );
        const data = await response.json();
        setOrders(data.result || []);
        setFilteredOrders(data.result || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const transformOrderData = (apiOrder) => {
    return {
      id: apiOrder.order_number,
      type: apiOrder.type,
      status: apiOrder.status_string.includes("Asignada")
        ? "Assigned"
        : "In transit",
      pickup: {
        location: apiOrder.destinations[0].address.split(",")[0],
        address: apiOrder.destinations[0].address,
        date: new Date(apiOrder.destinations[0].start_date).toLocaleDateString(
          "en-GB"
        ),
        time: new Date(apiOrder.destinations[0].start_date).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
      delivery: {
        location: apiOrder.destinations[1].address.split(",")[0],
        address: apiOrder.destinations[1].address,
        date: new Date(apiOrder.destinations[1].start_date).toLocaleDateString(
          "en-GB"
        ),
        time: new Date(apiOrder.destinations[1].start_date).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cargo Orders</h1>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "upcoming"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "completed"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={transformOrderData(order)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
