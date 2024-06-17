import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import credencialsFirebase from "./firebase/credentials";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { FirebaseContext } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Login from "./components/Login";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";
import { db } from "./firebase/firebase";
import Profile from "./components/Profile";
import Record from "./components/Record";

const auth = getAuth(credencialsFirebase);

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({ uid: user.uid, ...userDoc.data() });
        const userDocRef = doc(db, "users", user.uid);
        const recordCollectionRef = collection(userDocRef, "record");

        const unsubscribeRecord = onSnapshot(
          recordCollectionRef,
          (snapshot) => {
            setRecord(snapshot.docs.map((doc) => doc.data()));
          },
        );

        return () => unsubscribeRecord();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  return (
    <div>
      <FirebaseContext.Provider value={{ user: user, record: record }}>
        <Routes>
          <Route
            path="/"
            element={user ? <Home email={user.email} /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/:uidUser/record" element={<Record />} />
        </Routes>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
