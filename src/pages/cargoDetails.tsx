"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HeaderBell from "../components/HeaderBell";
import "../app/globals.css";

type Destination = {
  address: string;
  startDate?: number;
  endDate?: number;
  nickname?: string;
  place_id_pickup?: string;
  place_id_dropoff?: string;
  contact_info?: {
    name: string;
    telephone: string;
    email: string;
  };
};

type ApiOrder = {
  _id: string;
  order_number: string;
  reference_number?: string;
  status_string?: string;
  status?: number;
  destinations: Destination[];
  route?: {
    pickup: string;
    dropoff: string;
    route: string;
  };
  manager?: {
    nickname: string;
  };
  driver?: {
    nickname: string;
    telephone?: string;
    email?: string;
  };
  cargo?: {
    type: string;
    description: string;
  };
  pickup?: {
    date?: string | number;
  };
  delivery?: {
    time?: string;
  };
};

export default function CargoDetails() {
  const searchParams = useSearchParams();
  const orderParam = searchParams?.get("order");
  const order = orderParam
    ? JSON.parse(orderParam)
    : { id: "", delivery: { time: "" } };

  const [orderDetails, setOrderDetails] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Mock data de respaldo para desarrollo
        const mockData = {
          result: {
            _id: "624b5714296f8d9a820d01b3",
            order_number: order.id,
            reference_number: `REF-${order.id}`,
            status: 1,
            status_string: "Orden Asignada",
            destinations: [
              {
                address:
                  "Perif. Blvd. Manuel Ávila Camacho 3130, Tlalnepantla, Méx.",
                contact_info: {
                  name: "Contacto Mock",
                  telephone: "+525556789012",
                  email: "contacto@mock.com",
                },
              },
              {
                address: "Mariano Matamoros, Nuevo Laredo, Tamps.",
              },
            ],
            driver: {
              nickname: "Conductor Mock",
              telephone: "+525556789012",
              email: "conductor@mock.com",
            },
          },
        };

        let dataToUse = mockData; // Por defecto usamos mock data

        try {
          // Intento real de fetch solo en producción
          if (process.env.NODE_ENV === "production") {
            const detailedResponse = await fetch(
              `https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/${order.id}`
            );

            if (!detailedResponse.ok) {
              throw new Error(`HTTP error! status: ${detailedResponse.status}`);
            }

            const detailedData = await detailedResponse.json();
            if (detailedData.result) {
              dataToUse = detailedData;
            } else {
              // Si no hay datos en el primer endpoint, probamos con upcoming
              const upcomingResponse = await fetch(
                `https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming`
              );
              const upcomingData = await upcomingResponse.json();

              const foundOrder = upcomingData.result?.find(
                (item: ApiOrder) => item.order_number === order.id
              );

              if (foundOrder) {
                dataToUse = { result: foundOrder };
              }
            }
          }
        } catch (fetchError) {
          console.warn("Error fetching data, using mock fallback:", fetchError);
          // Continuamos con mock data si el fetch falla
        }

        // Procesamos los datos obtenidos (reales o mock)
        const processedOrder = {
          ...dataToUse.result,
          status_string:
            dataToUse.result.status === 1 ? "Orden Asignada" : "En espera",
          destinations: dataToUse.result.destinations || [],
          reference_number:
            dataToUse.result.reference_number ||
            `REF-${dataToUse.result.order_number}`,
        };

        setOrderDetails(processedOrder);
      } catch (error) {
        console.error("Error processing order details:", error);
        setError("Error al cargar los detalles de la orden");
        setOrderDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order.id]);

  // Función para obtener la ciudad desde la dirección
  const getCityFromAddress = (address: string) => {
    if (!address) return "N/A";
    const parts = address.split(",");
    const cityPart = parts[parts.length - 3]?.trim();
    return cityPart || "N/A";
  };

  // Función para acortar la dirección
  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return address.length > 25 ? `${address.substring(0, 25)}...` : address;
  };

  // Determinar el estado de la orden
  const isAccepted =
    orderDetails?.status === 1 ||
    orderDetails?.status_string?.includes("Asignada");

  // Extraer hora AM/PM
  const formatTime = (timeString?: string) => {
    if (!timeString) return "Hora no disponible";

    const [time, period] = timeString.split(" ");
    if (!time) return "Hora no disponible";

    return period?.toLowerCase() === "p.m." ? `${time} PM` : `${time} AM`;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <HeaderBell />
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-500 mt-2">Mostrando datos de ejemplo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <HeaderBell />

      {/* Primer div - Detalles principales */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Cargando detalles...</p>
        </div>
      ) : orderDetails ? (
        <>
          <div className="border border-[#555555] rounded-[20px] p-6 font-sans">
            {/* Encabezado con referencia y número de orden */}
            <div className="mb-6 text-[#EDEDED]">
              <h2 className="text-[13.1px]">
                Referencia: {orderDetails.reference_number}
              </h2>
              <p className="text-[17.5px]">
                Order #{orderDetails.order_number}
              </p>
            </div>

            {/* Contenedor principal para las secciones con imágenes */}
            <div className="flex">
              {/* Columna de imágenes */}
              <div className="flex flex-col items-center mr-4 mt-4">
                <img
                  src="/images/acceptedTruck.png"
                  alt="Delivery Truck"
                  className="h-[50px] mb-2"
                />
                <img
                  src="/images/deliveryLine.png"
                  alt="Delivery Line"
                  className="h-25 mb-2"
                />
                <img
                  src="/images/onHoldCircle.png"
                  alt="GPS"
                  className="h-[50px]"
                />
              </div>

              {/* Columna de contenido */}
              <div className="flex-1">
                {/* Sección de PICKUP */}
                <div className="mb-6">
                  <h3 className="text-[#4C4D4E] text-[11.2px]">PICKUP</h3>
                  <p className="text-[#EDEDED] text-[15.5px]">
                    {orderDetails.destinations?.[0]
                      ? getCityFromAddress(orderDetails.destinations[0].address)
                      : orderDetails.route?.pickup || "N/A"}
                  </p>
                  <p className="text-[#7B7D7E] text-[14.5px]">
                    {orderDetails.destinations?.[0]?.address
                      ? shortenAddress(orderDetails.destinations[0].address)
                      : "Dirección no disponible"}
                  </p>

                  {/* accepted div */}
                  <div className="flex w-3/10 rounded-[20px] items-center justify-center mt-3 bg-[#16191CFE]">
                    <img
                      src={
                        isAccepted
                          ? "/images/ellipseBlue.png"
                          : "/images/elipseGray.png"
                      }
                      alt="Status Indicator"
                      className="h-3 mr-2"
                    />
                    <label
                      htmlFor="accepted"
                      className="text-[#868889] text-[10px] text-center"
                    >
                      {isAccepted ? "Accepted" : "On hold"}
                    </label>
                  </div>
                </div>

                {/* Sección de DROPOFF */}
                <div className="">
                  <h3 className="text-[#4C4D4E] text-[10px]">DROPOFF</h3>
                  <p className="text-[#EDEDED] text-[15.5px]">
                    {orderDetails.destinations?.[1]
                      ? getCityFromAddress(orderDetails.destinations[1].address)
                      : orderDetails.route?.dropoff || "N/A"}
                  </p>
                  <p className="text-[#7B7D7E] text-[14.5px]">
                    {orderDetails.destinations?.[1]?.address
                      ? shortenAddress(orderDetails.destinations[1].address)
                      : "Dirección no disponible"}
                  </p>
                  <div className="flex w-3/10 rounded-[20px] items-center justify-center mt-3 bg-[#16191CFE]">
                    <img
                      src="/images/elipseGray.png"
                      alt="Elipse Blue"
                      className="h-3 mr-2"
                    />
                    <label
                      htmlFor="accepted"
                      className="text-[#868889] text-[11px] text-center"
                    >
                      On hold
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* segundo div - info de repartidor */}
          <div className="border border-[#555555] rounded-[20px] mt-4 font-sans">
            {/* Encabezado con estado y hora */}
            <div className="flex text-[#EDEDED]">
              <h2 className="text-[19.9px] text-center w-full my-8">
                {formatTime(order.delivery?.time || "12:00 p.m.")}
              </h2>
            </div>

            {/* Lista de estados con imágenes */}
            <div className="flex">
              {/* Columna izquierda - Imágenes */}
              <div className="flex flex-col items-center mx-6 justify-center mt-1">
                <img
                  src="/images/checkOrder.png"
                  alt="checkOrder"
                  className="h-5"
                />
                <div className="w-[2px] h-4 bg-[#FFEE00]"></div>
                <img
                  src="/images/checkOrder.png"
                  alt="checkOrder"
                  className="h-5"
                />
                <div className="w-[2px] h-4 bg-[#FFEE00]"></div>
                <img
                  src="/images/checkOrder.png"
                  alt="checkOrder"
                  className="h-5"
                />
                <div className="w-[2px] h-4 bg-[#555657]"></div>
                <img
                  src="/images/notCheckPoint.png"
                  alt="notCheckPoint"
                  className="h-6"
                />
              </div>

              {/* Columna derecha - Textos de estado */}
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <span className="text-[#EDEDED] text-[14px]">
                    Created Order
                  </span>
                </div>

                <div>
                  <span className="text-[#EDEDED] text-[14px]">
                    {isAccepted ? "Accepted Order" : "Order Received"}
                  </span>
                </div>

                <div>
                  <span className="text-[#EDEDED] text-[14px]">
                    Pickup set up by {orderDetails.driver?.nickname || "Driver"}
                  </span>
                </div>

                <div>
                  <span className="text-[#EDEDED] text-[14px]">
                    Pickup Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Track Order */}
            <div className="flex">
              <button className="w-full h-[74px] bg-[#FFEE00] text-[#080C0F] py-3 rounded-b-[20px] mt-6 text-[20px]">
                Track Order
              </button>
            </div>
          </div>

          {/* Sección de Pickup Data */}
          <div className="pt-4">
            <button className="flex justify-between w-full items-center h-[64.17px] text-[#EDEDED] text-[15.3px] border border-[#555555] rounded-[20px] p-5 mb-7">
              Pickup Data
              <img
                src="/images/upArrow.png"
                alt="up arrow"
                className="h-[12px]"
              />
            </button>

            <p className="text-[#EDEDED] text-[14px]">
              {orderDetails.destinations?.[0]?.address ||
                "Dirección no disponible"}
            </p>

            <div className="flex justify-start text-[#EDEDED] text-[14.6px] my-4">
              <span>
                {/* Aqui cambio el formato de fecha a fecha en*/}
                {(() => {
                  if (!order.pickup?.date) return "Fecha no disponible";

                  const date = new Date(order.pickup.date);

                  if (isNaN(date.getTime())) return "Fecha no válida";
                  const options: Intl.DateTimeFormatOptions = {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  };
                  return date.toLocaleDateString("es-ES", options);
                })()}
              </span>
              <span className="ml-5">•</span>
              <span>{formatTime(order.delivery?.time || "12:00 p.m.")}</span>
            </div>

            <p className="text-[#EDEDED] text-[14px] my-4">
              {orderDetails.destinations?.[0]?.contact_info?.telephone ||
                orderDetails.driver?.telephone ||
                "Teléfono no disponible"}
            </p>

            <p className="text-[#EDEDED] text-[14.7px] mt-2">
              {orderDetails.destinations?.[0]?.contact_info?.email ||
                orderDetails.driver?.email ||
                "Email no disponible"}
            </p>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No se encontraron detalles para esta orden.
          </p>
        </div>
      )}
    </div>
  );
}
