import React, { useContext, useState } from "react";
import logo from "../assets/logo-removebg-preview.png";
import waiter from "../assets/camarero.png";
import order from "../assets/comida.png";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import WaitTime from "./WaitTime";
import CallToWaiter from "./CallToWaiter";
import Record from "./Record";

const Header = () => {
  const navigate = useNavigate();
  const { user, record } = useContext(FirebaseContext);
  const [callToWaiter, setCallToWaiter] = useState(false);
  const [showWaitTime, setShowWaitTime] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const goHome = () => {
    navigate("/home");
  };

  const goProfile = () => {
    navigate("/profile");
  };
  // TODO: aqui tener en cuenta que me esta recorriendo mi historial, tengo que tener en cuenta tambien
  // el estado o algo para que me enseñe el que tengo ahora mismo y no una mesa en la que estuve hace un mes
  const localRecord = record.find((rcd) => rcd.category === "local");
  return (
    <div class="flex px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100">
      {showWaitTime && <WaitTime setShowWaitTime={setShowWaitTime} />}
      <button
        onClick={() => {
          !user?.role && goHome();
        }}
      >
        <img class="w-16" src={logo} alt="Your Company" />
      </button>
      {!user?.role && (
        <div class="ml-auto flex items-center space-x-4">
          {callToWaiter && <CallToWaiter setCallToWaiter={setCallToWaiter} />}
          {localRecord && (
            <button onClick={() => setCallToWaiter(true)}>
              <img src={waiter} alt="icon-waiter" class="h-10 w-10" />
            </button>
          )}
          <button onClick={() => setShowWaitTime(true)}>
            <img src={order} alt="icon-order" class="h-12 w-12" />
          </button>
          {showRecord && <Record setShowRecord={setShowRecord} />}
          <button onClick={() => setShowRecord(true)}>
            <svg
              class="h-10 w-10 text-teal-200"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <rect x="5" y="3" width="14" height="18" rx="2" />{" "}
              <line x1="9" y1="7" x2="15" y2="7" />{" "}
              <line x1="9" y1="11" x2="15" y2="11" />{" "}
              <line x1="9" y1="15" x2="13" y2="15" />
            </svg>
          </button>
        </div>
      )}

      <button
        class="ml-auto flex items-center space-x-4"
        onClick={() => goProfile()}
      >
        <svg
          class="h-10 w-10 text-teal-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Header;
