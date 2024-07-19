import React, { useContext } from "react";
import waiter from "../assets/camarero.png";
import { FirebaseContext } from "../firebase";

const CallToWaiter = ({ setCallToWaiter }) => {
  const { token } = useContext(FirebaseContext);

  const getTheCheck = () => {
    console.log("traer cuenta");
  };

  const callTheWaiter = () => {
    sendPushNotification();
  };

  const sendPushNotification = async () => {
    try {
      await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAAjS_rHrQ:APA91bFIpxZwmJhO_6DJ6Kf4uHKXYuz86RJGYbUPhWqm4Qco5TeQytN1s5HmxQTzY2oUfEqtt3n3fNqhfDWv-Wnaw50C41c2C4qBmQ4cJnozWExbtMTUv2DJZXEHgHtGRIhtV5LbG1HX", // Reemplaza con tu clave de servidor de Firebase
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title: "Título de la notificación",
            body: "Cuerpo de la notificación",
          },
        }),
      });
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      class="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div class="relative w-auto h-auto bg-white rounded overflow-auto">
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 class="text-lg font-semibold dark:text-white flex justify-center items-center">
            <img src={waiter} alt="icon-waiter" class="h-10 w-10 mr-1" />
            <span class="text-gray-900 text-lg font-semibold">
              Llamar al camarero
            </span>
          </h3>
          <button
            type="button"
            onClick={() => setCallToWaiter(false)}
            class="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white"
            data-modal-toggle="crud-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col justify-center items-center p-4 dark:border-gray-600">
          <button
            class="my-2  bg-teal-400 p-4 rounded-full"
            onClick={() => getTheCheck()}
          >
            <span>Traer la cuenta</span>
          </button>
          <button
            class="my-2  bg-teal-400 p-4 rounded-full"
            onClick={() => callTheWaiter()}
          >
            <span>Acercarse a la mesa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToWaiter;
