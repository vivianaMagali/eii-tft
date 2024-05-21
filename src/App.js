import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import credencialsFirebase from "./firebase/credentials";
import firebase, { FirebaseContext } from "./firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Home from "./components/Home";

const auth = getAuth(credencialsFirebase);

function App() {
  const [user, setUser] = useState();

  // onAuthStateChanged(auth, (userLogged) => {
  //   if (userLogged) {
  //     setUser(userLogged);
  //   } else {
  //     setUser(null);
  //   }
  // });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userLogged) => {
      if (userLogged) {
        setUser(userLogged);
      } else {
        setUser(null);
      }
    });

    // Limpia la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <FirebaseContext.Provider value={{ prueba: "prueba" }}>
        {/* <div> */}
        {user ? <Home email={user.email} /> : <Login />}
        {/* <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes> */}
        {/* </div> */}
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
