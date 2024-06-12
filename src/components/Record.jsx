import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams } from "react-router";
import Header from "./Header";

const Record = () => {
  const { uidUser } = useParams();
  const [record, setRecord] = useState([]);

  useEffect(() => {
    const userDocRef = doc(db, "users", uidUser);
    const recordCollectionRef = collection(userDocRef, "record");

    const unsubscribeRecord = onSnapshot(recordCollectionRef, (snapshot) => {
      setRecord(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribeRecord();
  }, [uidUser]);

  const repeatOrder = () => {
    console.log("repeatOrder");
  };

  console.log("record", record);

  return (
    <>
      <Header />
      {record.length > 0 ? (
        <div className="w-1/3 mx-auto">
          {record.map((record, index) => (
            <div className="bg-white shadow-md rounded-lg overflow-hidden my-3 py-2">
              {/* <div className=""> */}
              <div className="bg-teal-600 text-white py-2 px-3 text-center">
                <h1 className="text-2xl font-semibold">{record.name}</h1>
              </div>
              <span className="italic text-xs flex justify-end px-3">
                {record.date}
              </span>
              {record.order.map((order, index) => (
                <ul className="py-1 px-3" key={`${order.name + "-" + index}`}>
                  <li className="flex justify-between mb-1">
                    <div>
                      <span className="font-semibold">x{order.amount}</span>
                      <span> {order.name}</span>
                    </div>
                    <span className="text-gray-600">
                      {order.amount * order.price}€
                    </span>
                  </li>
                </ul>
              ))}

              <div>
                <span className="font-semibold flex justify-end px-3">
                  Total: {record.total?.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => repeatOrder()}
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
                >
                  Repetir pedido
                </button>
              </div>
              {/* </div> */}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default Record;
