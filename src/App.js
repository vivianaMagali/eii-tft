import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import credencialsFirebase from "./firebase/credentials";
import firebase, { FirebaseContext } from "./firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";

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
        <Routes>
          <Route
            path="/"
            element={user ? <Home email={user.email} /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Routes>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
