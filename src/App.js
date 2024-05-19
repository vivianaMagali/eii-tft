

import { useState } from 'react';
import appFirebase from './components/creadentials';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Routes, Route} from 'react-router';
import Login from './components/Login';
import Home from './components/Home';

const auth= getAuth(appFirebase)

function App() {

  const [user, setUser] = useState();

  onAuthStateChanged(auth, (userLogged)=> {
    if(userLogged){
      setUser(userLogged)
    }else{
      setUser(null)
    }
  })

  return (
    <div>
      {user ? <Home email={user.email}/> : <Login/> }
      <Routes>
        {/* <Route path="/" element={<Login/>}/>
        <Route path="/" element={<Home />}/> */}
      </Routes>
    </div>
  );
}

export default App
