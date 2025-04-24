import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importa useRouter

export default function HeaderBell() {
  const router = useRouter(); // Inicializa el router

  return (
    <>
      {/* Título de la página e iconos */}
      <div className="flex items-center justify-between mb-6">
        {/* Flecha de retroceso (izquierda) */}
        <button
          className="flex-shrink-0"
          onClick={() => router.push("/")} // Navega a page.tsx (ruta raíz)
        >
          <Image
            src="/images/backArrow.png"
            alt="Back"
            width={10}
            height={18}
          />
        </button>

        {/* Título centrado (opcionalmente ajustable) */}
        <h1 className="text-[20px] font-bold text-[#EDEDED] mx-4 flex-grow text-center">
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
    </>
  );
}
