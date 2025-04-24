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
};

type ApiOrder = {
  _id: string;
  order_number: string;
  reference_number?: string;
  status_string?: string;
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
};

export default function CargoDetails() {
  const searchParams = useSearchParams();
  const orderParam = searchParams?.get("order");
  const order = orderParam ? JSON.parse(orderParam) : { id: "" };

  const [orderDetails, setOrderDetails] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order.id) {
        try {
          setIsLoading(true);

          // Intentamos obtener los datos del endpoint
          const detailedResponse = await fetch(
            `https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders`
          );
          const detailedData = await detailedResponse.json();

          console.log("Datos obtenidos del endpoint:", detailedData.result);

          // Asignamos todos los datos del objeto result
          if (detailedData.result.order_number === order.id) {
            setOrderDetails(detailedData.result);
          } else {
            setOrderDetails(null);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [order.id]);

  // Función para obtener la ciudad desde la dirección
  const getCityFromAddress = (address: string) => {
    if (!address) return "N/A";
    const parts = address.split(",");
    return parts[parts.length - 3]?.split(" ").slice(2).join(" ") || "N/A";
  };

  // Función para acortar la dirección
  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return address.length > 25 ? `${address.slice(0, 25)}...` : address;
  };

  // Determinar si está aceptado (usamos status 1 como aceptado)
  const isAccepted = orderDetails?.status_string?.includes("Asignada") || false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <HeaderBell />
      {/* Primer div */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 ">
          <p className="text-gray-500">Cargando detalles...</p>
        </div>
      ) : orderDetails ? (
        <div className="border border-[#555555] rounded-[20px] p-6 font-sans">
          {/* Encabezado con referencia y número de orden */}
          <div className="mb-6 text-[#EDEDED]">
            <h2 className="text-[13.1px]">
              Referencia: {orderDetails.reference_number || "Sin referencia"}
            </h2>
            <p className="text-[17.5px]">Order #{orderDetails.order_number}</p>
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
                className="h-15 mb-2"
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
                <h3 className=" text-[#4C4D4E] text-[11.2px]">PICKUP</h3>
                <p className="text-[#EDEDED] text-[15.5px]">
                  {orderDetails.destinations.length > 0
                    ? getCityFromAddress(orderDetails.destinations[0].address)
                    : orderDetails.route?.pickup || "N/A"}
                </p>
                <p className="text-[#7B7D7E] text-[14.5px]">
                  {orderDetails.destinations.length > 0
                    ? shortenAddress(orderDetails.destinations[0].address)
                    : "Dirección no disponible"}
                </p>

                {/* accepted div */}
                <div className="flex w-3/10 rounded-[20px] items-center justify-center mt-3 bg-[#16191CFE]">
                  <img
                    src="/images/ellipseBlue.png"
                    alt="Elipse Blue"
                    className="h-3 mr-2"
                  />
                  <label
                    htmlFor="accepted"
                    className="text-[#868889] text-[10px] text-center"
                  >
                    Accepted
                  </label>
                </div>
              </div>

              {/* Sección de DROPOFF */}
              <div className="">
                <h3 className=" text-[#4C4D4E] text-[10px]">DROPOFF</h3>
                <p className="text-[#EDEDED] text-[15.5px]">
                  {orderDetails.destinations.length > 1
                    ? getCityFromAddress(orderDetails.destinations[1].address)
                    : orderDetails.route?.dropoff || "N/A"}
                </p>
                <p className="text-[#7B7D7E] text-[14.5px]">
                  {orderDetails.destinations.length > 1
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
      ) : (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No se encontraron detalles para esta orden.
          </p>
        </div>
      )}

      {/* segundo div info de repartidor */}
      {/* segundo div info de repartidor */}
      {orderDetails && (
        <div className="border border-[#555555] rounded-[20px]  mt-4 font-sans">
          {/*Aqui va la imagen del vendedor */}
          {/* Encabezado con estado y hora */}
          <div className="flex text-[#EDEDED] ">
            <h2 className="text-[19.9px] text-center w-full my-8">
              {order.delivery.time.split(" ")[0]}{" "}
              {order.delivery.time.split(" ")[1] >= "p.m." ? "PM" : "AM"}
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
              {/* Línea horizontal */}
              <div className="w-[2px] h-4 bg-[#FFEE00]"></div>
              <img
                src="/images/checkOrder.png"
                alt="checkOrder"
                className="h-5"
              />
              {/* Línea horizontal */}
              <div className="w-[2px] h-4 bg-[#FFEE00]"></div>
              <img
                src="/images/checkOrder.png"
                alt="checkOrder"
                className="h-5"
              />
              {/* Línea horizontal */}
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
                  Accepted Order
                </span>
              </div>

              <div>
                <span className="text-[#EDEDED] text-[14px]">
                  Pickup set up by {orderDetails.driver?.nickname || "William"}
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
          <div className="flex ">
            <button className="w-full h-[74px] bg-[#FFEE00] text-[#080C0F] py-3 rounded-b-[20px] mt-6 text-[20px]">
              Track Order
            </button>
          </div>
        </div>
      )}
      {/* Sección de Pickup Data */}
      <div className=" pt-4">
        <button className=" flex justify-between w-full items-center h-[64.17px] text-[#EDEDED] text-[15.3px] border border-[#555555] rounded-[20px] p-5 mb-7">
          Pickup Data
          <img src="/images/upArrow.png" alt="up arrow" className="h-[12px]" />
        </button>

        <p className="text-[#EDEDED] text-[14px]">
          {orderDetails?.destinations?.[0]?.address}
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
          <span>
            {order.delivery?.time
              ? order.delivery.time.split(" ")[0]
              : "Hora no disponible"}
          </span>
        </div>

        <p className="text-[#EDEDED] text-[14px] my-4">
          {orderDetails?.driver?.telephone
            ? `${orderDetails.driver.telephone}`
            : "+525567890346"}
        </p>

        {orderDetails && (
          <p className="text-[#EDEDED] text-[14.7px] mt-2">
            {orderDetails.driver?.email || "johndoe@gmail.com"}
          </p>
        )}
      </div>
    </div>
  );
}
