"use client";
import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import Image from "next/image";

// Definición de tipos para TypeScript
type Destination = {
  address: string;
  start_date: number;
  end_date: number;
  nickname: string;
  show_navigation: boolean;
};

type ApiOrder = {
  _id: string;
  status: number;
  order_number: string;
  manager: string;
  driver: string;
  version: string;
  type: "FTL" | "FCL" | string;
  destinations: Destination[];
  start_date: number;
  end_date: number;
  is_today: boolean;
  status_string: string;
  status_class: string;
  driver_thumbnail: string | null;
};

type TransformedOrder = {
  id: string;
  type: string;
  status: "Assigned" | "In transit" | string;
  pickup: {
    location: string;
    address: string;
    date: string;
    time: string;
  };
  delivery: {
    location: string;
    address: string;
    date: string;
    time: string;
  };
};

const OrdersPage = () => {
  // Estados del componente
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "past">(
    "upcoming"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efecto para cargar los pedidos al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming"
        );
        const data = await response.json();

        // Verificación de tipo para la respuesta de la API
        const apiOrders: ApiOrder[] = data.result || [];
        setOrders(apiOrders);
        setFilteredOrders(apiOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Efecto para filtrar pedidos cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Función para transformar los datos de la API al formato que espera el componente OrderCard
  const transformOrderData = (apiOrder: ApiOrder): TransformedOrder => {
    // Validación básica para asegurar que hay al menos dos destinos
    if (apiOrder.destinations.length < 1) {
      throw new Error("Order must have at least two destinations");
    }

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
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-[65px] ">
      <div className="mx-[46px]">
        {/* Título de la página e iconos */}
        <div className="flex items-center justify-between mb-6  ">
          {/* Flecha de retroceso (izquierda) */}
          <button className="flex-shrink-0">
            <Image
              src="/images/backArrow.png"
              alt="Back"
              width={10}
              height={18}
            />
          </button>

          {/* Título centrado (opcionalmente ajustable) */}
          <h1 className="text-2xl font-bold text-[#EDEDED] mx-4 flex-grow text-center">
            Cargo Orders
          </h1>

          {/* Icono de campana (derecha) */}
          <button className="flex-shrink-0">
            <Image
              src="/images/Notification.png"
              alt="Notifications"
              width={24}
              height={26}
            />
          </button>
        </div>
        {/* Pestañas de navegación */}
        <div className="flex border-b mb-6 justify-between">
          <button
            className={`  ${
              activeTab === "upcoming" ? "text-[#FFEE00]" : "text-[#EDEDED]"
            } relative text-left ${
              activeTab === "upcoming"
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[24.45px] after:h-[2px] after:bg-[#FFEE00]"
                : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={` ${
              activeTab === "completed" ? "text-[#FFEE00]" : "text-[#EDEDED]"
            } relative mx-auto ${
              activeTab === "completed"
                ? "after:content-[''] after:absolute after:bottom-0 after:left-3 after:-translate-x-1/2 after:w-[24.45px] after:h-[2px] after:bg-[#FFEE00]"
                : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "past" ? "text-[#FFEE00]" : "text-[#EDEDED]"
            } relative text-right ${
              activeTab === "past"
                ? "after:content-[''] after:absolute after:bottom-0 after:left-4 after:w-[24.45px] after:h-[2px] after:bg-[#FFEE00]"
                : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>
        {/* Barra de búsqueda */}
        <div className="mb-6 relative">
          <div
            className="flex items-center border-b border-[#2C2C2C]"
            style={{ width: "430px", height: "50px" }}
          >
            <img
              src="images/searchIcon.png"
              alt="Search icon"
              className="h-5 w-5 ml-3" // Ajusta el tamaño del icono según necesites
            />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full px-4 py-2 focus:outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : /* Estado cuando no hay resultados */
        filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#EDEDED]">No orders found</p>
          </div>
        ) : (
          /* Lista de pedidos filtrados */
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={transformOrderData(order)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
