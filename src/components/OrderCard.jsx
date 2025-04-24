"use client";

import React from "react";
import { useRouter } from "next/navigation";

const OrderCard = ({ order }) => {
  const router = useRouter();

  const statusClasses = {
    Assigned: "text-[#EDEDED]",
    Completed: "text-[#EDEDED]",
    "In transit": "text-[#EDEDED]",
  };

  // Función para manejar el clic del botón
  const handlePickupClick = () => {
    const orderQuery = encodeURIComponent(JSON.stringify(order));
    router.push(`/cargoDetails?order=${orderQuery}`);
  };

  const btn = (
    <button
      className="w-1/3 bg-[#FFEE00] hover:bg-[#A89E00] active:bg-[#FFD700] text-[#080B11] text-[15.3px] mb-0 flex items-center px-5 py-2 rounded-[20px] rounded-tr-none h-[51px] justify-around"
      style={{
        boxShadow: "inset 3px -3px 7px #080C0F80",
      }}
    >
      Resume
      <img src="/images/eye.png" alt="eye" className="h-4" />
    </button>
  );

  return (
    <>
      {/* Encabezado con el número de orden */}
      <div className="flex items-center gap-2">
        <h3 className="text-[17.3px] font-semibold text-[#969798]">Order </h3>
        <h3 className="text-[17.3px] font-semibold text-[#EDEDED]">
          #{order.id}
        </h3>
      </div>

      {/* Contenedor principal con grid */}
      <div className=" border-[1.5px] border-[#848484] rounded-[20px]  gradient-gray">
        {/* Sección superior con badges */}
        <div className="flex justify-between pt-4 px-4 ">
          <div className="flex items-center">
            {order.type === "FCL" ? (
              <img
                src="/images/container.png"
                alt="container"
                className="h-6"
              />
            ) : (
              <img src="/images/truck.png" alt="truck" className="h-3" />
            )}
            <span className="px-2 py-1 rounded font-medium text-[#EDEDED] text-[18px]">
              {order.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {order.status === "In transit" && (
              <img
                src="/images/ellipseBlue.png"
                alt="blue point"
                className="w-[10.03]"
              />
            )}
            <span
              className={`px-2 py-1 rounded text-[10.4px] ${
                statusClasses[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr
          className="border-[#606364] border-opacity-100 my-4"
          style={{ borderWidth: "0.6px" }}
        />

        {/* Grid principal */}
        <div className="grid grid-cols-12 gap-4 ">
          {/* Columna izquierda - Imágenes */}
          <div className="col-span-2 flex flex-col items-center justify-between my-9 gap-3">
            <img
              src="/images/deliveryTruck.png"
              alt="Delivery Truck"
              className="h-5"
            />
            <img
              src="/images/deliveryLine.png"
              alt="Delivery Line"
              className="h-12"
            />
            <img src="/images/gps.png" alt="GPS" className="h-5" />
          </div>

          {/* Columna central - Información de ubicación */}
          <div className="col-span-7 space-y-3">
            {/* Información de recogida */}
            <div className="flex flex-col mt-4">
              <h2 className="text-[#535455] text-[10.9px]">PICKUP</h2>
              <p className="font-medium text-[#EDEDED]">
                {order.pickup.address
                  .split(",")[2]
                  .split(" ")
                  .slice(2)
                  .join(" ")}
              </p>
              <p className="text-sm text-[#535455]">
                {order.pickup.address.substring(0, 26) + ".."}
              </p>
            </div>

            {/* Información de entrega */}
            <div className="flex mt-7">
              <div className="flex-1">
                <h2 className="text-[#535455] text-[10.9px]">DROPOFF</h2>
                <p className="font-medium text-[#EDEDED]">
                  {order.delivery.address
                    .split(",")[2]
                    .split(" ")
                    .slice(2)
                    .join(" ")}
                </p>
                <p className="text-sm text-[#535455]">
                  {order.delivery.address.substring(0, 26) + ".."}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Fechas y horas */}
          <div className="flex col-span-3 space-y-10 mt-9 pr-5 flex-col w-full">
            <div>
              <p className="text-[12px] text-[#646666]">{order.pickup.date}</p>
              <p className="text-sm text-[#EDEDED] ml-6">
                {order.pickup.time.split(" ")[0]}
              </p>
            </div>
            <div>
              <p className="text-[#646666] text-[12px]">
                {order.delivery.date}
              </p>
              <p className="text-sm text-[#EDEDED] text[12.2px] ml-6">
                {order.delivery.time.split(" ")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Botones en la parte inferior */}
        {order.status === "In transit" ? (
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePickupClick} // Manejador de clic añadido
              className="w-[199px] bg-[#FFEE00] hover:bg-[#A89E00] active:bg-[#FFD700] text-[#080B11] px-4 py-2 rounded-[20px] text-[15.3px] rounded-tl-none"
              style={{
                boxShadow: "inset -3px -3px 7px #080C0F80",
              }}
            >
              It's time for pickup
            </button>
            {btn}
          </div>
        ) : (
          <div className="flex justify-end mt-6">{btn}</div>
        )}
      </div>
    </>
  );
};

export default OrderCard;
