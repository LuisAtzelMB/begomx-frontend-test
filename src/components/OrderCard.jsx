import React from "react";

const OrderCard = ({ order }) => {
  const statusClasses = {
    "In transit": "bg-green-100 text-green-800",
    Assigned: "bg-blue-100 text-blue-800",
    Completed: "bg-gray-100 text-gray-800",
    // Add more status types as needed
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              order.type === "FCL"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {order.type}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              statusClasses[order.status]
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex">
          <div className="mr-3 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">{order.pickup.location}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{order.pickup.date}</span>
              <span>{order.pickup.time}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {order.pickup.address}
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="mr-3 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">{order.delivery.location}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{order.delivery.date}</span>
              <span>{order.delivery.time}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {order.delivery.address}
            </p>
          </div>
        </div>
      </div>

      {order.status === "Assigned" && (
        <div className="flex justify-between mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            It's time for pickup
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
            Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
