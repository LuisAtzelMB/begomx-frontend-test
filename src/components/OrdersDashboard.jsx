import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersDashboard = () => {
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [upcomingRes, allRes] = await Promise.all([
        axios.get(
          "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming"
        ),
        axios.get(
          "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders"
        ),
      ]);

      // Aseguramos que upcomingOrders siempre sea un array
      const upcomingData = Array.isArray(upcomingRes.data)
        ? upcomingRes.data
        : [];
      setUpcomingOrders(upcomingData);

      // Verificamos que allRes.data.result no sea null o undefined antes de setearlo
      const allOrdersData = allRes.data.result || null;
      setAllOrders(allOrdersData);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos Próximos</h1>
      <ul className="mb-6">
        {upcomingOrders.map((order, index) => (
          <li key={index} className="mb-2 p-2 border rounded">
            <strong>{order.order_number}</strong> -{" "}
            {order.route?.route || "Ruta desconocida"}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-4">Detalles de un Pedido</h2>
      {allOrders ? (
        <div className="p-4 border rounded bg-gray-50">
          <p>
            <strong>Referencia:</strong> {allOrders.reference_number}
          </p>
          <p>
            <strong>Descripción:</strong> {allOrders.cargo.description}
          </p>
          <p>
            <strong>Ruta:</strong> {allOrders.route.route}
          </p>
          <p>
            <strong>Cliente:</strong> {allOrders.invoice.fullname}
          </p>
          <p>
            <strong>Chofer:</strong> {allOrders.driver.nickname}
          </p>
          <p>
            <strong>Camión:</strong> {allOrders.truck.attributes.plates} -{" "}
            {allOrders.truck.attributes.brand}
          </p>
        </div>
      ) : (
        <p>No se encontraron pedidos.</p>
      )}
    </div>
  );
};

export default OrdersDashboard;
